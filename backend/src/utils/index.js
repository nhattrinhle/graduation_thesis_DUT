const axios = require('axios')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment-timezone')
const { BadRequestError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const { GOOGLE_API_URL, ROUNDS_SALT, TIMEZONE, SERVICES } = require('../core/data.constant')

const calculateDailyCountsAndTotalCount = (dateRange, dataByDate) => {
    const dailyCounts = new Map(dateRange.map((date) => [moment(date).format('YYYY-MM-DD'), 0]))
    const totalCount = dataByDate.reduce((total, item) => {
        if (item.date) {
            dailyCounts.set(item.date, item.count)
            return total + item.count
        }
        return total
    }, 0)
    return { totalCount, dailyCounts }
}

const createDateRange = (fromDate, toDate) => {
    const dateRange = []
    let currentDate = fromDate
    while (moment(currentDate) <= moment(toDate)) {
        dateRange.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'days')
    }
    return dateRange
}

const calculateSavedRemainingRentalTime = (expiresAt) => {
    const remainingTime = new Date(expiresAt) - new Date()
    return remainingTime > 0 ? remainingTime : 0
}

const calculateExpiresDate = (duration) => {
    if (!SERVICES.RENTAL_DAY_ENUM.includes(duration)) {
        throw new BadRequestError(ERROR_MESSAGES.SERVICE.INVALID_SERVICE_RENTAL_PERIOD)
    }
    const expiresDate = moment().tz(TIMEZONE).add(duration, 'days')
    return expiresDate.toDate()
}

const setStartAndEndDates = (fromDateRange, toDateRange) => {
    const fromDate = moment.tz(fromDateRange, TIMEZONE)
    fromDate.startOf('day')
    const toDate = moment.tz(toDateRange, TIMEZONE)
    toDate.endOf('day')
    return { fromDate: fromDate.toDate(), toDate: toDate.toDate() }
}

const verifyGoogleToken = async (accessToken) => {
    try {
        const response = await axios.get(`${GOOGLE_API_URL}/v3/tokeninfo?access_token=${accessToken}`)
        const { aud: clientId } = response.data

        if (clientId !== process.env.FE_GOOGLE_CLIENT_ID) {
            throw new Error(ERROR_MESSAGES.USER.LOGIN_GOOGLE.INVALID_CLIENT_ID)
        }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.USER.LOGIN_GOOGLE.INVALID_ACCESS_TOKEN)
    }
}

const generateVerifyEmailCode = async (userId) => {
    const uniqueCode = uuidv4() + userId
    const hashVerificationCode = await bcrypt.hash(uniqueCode, ROUNDS_SALT)

    return { uniqueCode, hashVerificationCode }
}

const hashPassword = async (password) => {
    return bcrypt.hash(password, ROUNDS_SALT)
}

const isValidKeyOfModel = async (model, key, errorMessage) => {
    if (!key) {
        return null
    }

    const validEntity = await model.findByPk(key)
    if (!validEntity) {
        throw new BadRequestError(errorMessage)
    }

    return key
}

const paginatedData = ({ data, page, limit }) => {
    const { count: totalItems, rows } = data
    const totalPages = Math.ceil(totalItems / limit)

    return { totalPages, currentPage: Number(page), totalItems, data: rows }
}

const getExistingKeysInObject = (object, keys) => {
    return keys.reduce((newObj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key) && Object.keys(object[key]).length > 0) {
            return { ...newObj, [key]: object[key] }
        }

        return newObj
    }, {})
}

module.exports = {
    calculateDailyCountsAndTotalCount,
    createDateRange,
    calculateSavedRemainingRentalTime,
    calculateExpiresDate,
    setStartAndEndDates,
    verifyGoogleToken,
    generateVerifyEmailCode,
    hashPassword,
    isValidKeyOfModel,
    paginatedData,
    getExistingKeysInObject
}
