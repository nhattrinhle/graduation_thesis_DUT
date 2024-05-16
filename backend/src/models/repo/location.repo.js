const db = require('..')
const geocoder = require('../../config/map.config')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')

/**
 * Get full location text from location information
 * @param {Object} params
 * @param {string} params.provinceCode
 * @param {string} params.districtCode
 * @param {string} params.wardCode
 * @param {string} params.street
 * @param {string} params.address
 * @returns {Promise<string>} - Full location text
 */
const getFullLocationText = async ({ provinceCode, districtCode, wardCode, street, address }) => {
    const province = await db.Provinces.findOne({ where: { provinceCode } })
    const district = await db.Districts.findOne({ where: { districtCode } })
    const ward = await db.Wards.findOne({ where: { wardCode } })

    return [address, street, ward.nameEn, district.nameEn, province.nameEn].filter(Boolean).join(', ')
}

const checkProvinceCode = async (provinceCode) => {
    const { provinceCode: validProvinceCode } = (await db.Provinces.findOne({ where: { provinceCode } })) || {}
    if (!validProvinceCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_PROVINCE)
    }
    return validProvinceCode
}

const checkDistrictCode = async (districtCode, provinceCode) => {
    const where = provinceCode ? { districtCode, provinceCode } : { districtCode }

    const { districtCode: validDistrictCode } = (await db.Districts.findOne({ where })) || {}

    if (!validDistrictCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_DISTRICT)
    }

    return validDistrictCode
}

const checkWardCode = async (wardCode, districtCode) => {
    const where = districtCode ? { wardCode, districtCode } : { wardCode }
    const { wardCode: validWardCode } = (await db.Wards.findOne({ where })) || {}
    if (!validWardCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.INVALID_WARD)
    }
    return validWardCode
}

/**
 * Check if location information is valid
 * @param {Object} userBody
 * @returns {Promise<boolean>}
 */
const checkLocation = async ({ provinceCode, districtCode, wardCode }) => {
    const validProvinceCode = await checkProvinceCode(provinceCode)
    const validDistrictCode = await checkDistrictCode(districtCode, validProvinceCode)
    await checkWardCode(wardCode, validDistrictCode)
}

const getAllProvinces = async () => {
    try {
        const provincesList = await db.Provinces.findAll()
        if (!provincesList) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_PROVINCES)
        }

        if (provincesList.length === 0) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.PROVINCES_NOT_FOUND)
        }

        return provincesList
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_PROVINCES)
    }
}

const getAllDistrictsByProvinceCode = async (provinceCode) => {
    if (!provinceCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.REQUIRE_PROVINCE)
    }

    await checkProvinceCode(provinceCode)

    try {
        const districtsList = await db.Districts.findAll({ where: { provinceCode } })
        if (!districtsList) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_DISTRICTS)
        }

        if (districtsList.length === 0) {
            throw new NotFoundError(ERROR_MESSAGES.LOCATION.DISTRICTS_NOT_FOUND)
        }
        return districtsList
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_DISTRICTS)
    }
}

const getAllWardsByDistrictCode = async (districtCode) => {
    if (!districtCode) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.REQUIRE_DISTRICT)
    }
    await checkDistrictCode(districtCode)

    try {
        const wardsList = await db.Wards.findAll({ where: { districtCode } })
        if (!wardsList) {
            throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_WARDS)
        }

        if (wardsList.length === 0) {
            throw new NotFoundError(ERROR_MESSAGES.LOCATION.WARDS_NOT_FOUND)
        }
        return wardsList
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_WARDS)
    }
}

const getCoordinates = async ({ provinceCode, districtCode, wardCode, address, street }) => {
    try {
        const locationText = await getFullLocationText({ provinceCode, districtCode, wardCode, address, street })
        const res = await geocoder.geocode(locationText)
        return { lat: res[0].latitude, lng: res[0].longitude }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.GET_COORDINATES)
    }
}

const createLocation = async ({ provinceCode, districtCode, wardCode, address, street }, transaction) => {
    await checkLocation({ provinceCode, districtCode, wardCode })
    const { lat, lng } = await getCoordinates({ provinceCode, districtCode, wardCode, address, street })
    const newLocation = await db.Locations.create(
        { provinceCode, districtCode, wardCode, address, street, lat, lng },
        { transaction }
    )
    if (!newLocation) {
        throw new BadRequestError(ERROR_MESSAGES.LOCATION.CREATE_NEW_LOCATION)
    }
    return newLocation
}

module.exports = {
    getCoordinates,
    getFullLocationText,
    createLocation,
    getAllWardsByDistrictCode,
    getAllDistrictsByProvinceCode,
    getAllProvinces,
    checkProvinceCode,
    checkDistrictCode,
    checkWardCode,
    checkLocation
}
