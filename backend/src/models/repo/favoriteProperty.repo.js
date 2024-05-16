const db = require('..')
const { SCOPES, PROPERTY_STATUS } = require('../../core/data.constant')
const { BadRequestError, NotFoundError } = require('../../core/error.response')
const { ERROR_MESSAGES } = require('../../core/message.constant')
const { getScopesArray } = require('./property.repo')

const getFavoritesList = async (userId) => {
    try {
        const { rows: favoritesList, count } = await db.FavoriteProperties.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: db.Properties,
                    as: 'propertyInfo',
                    include: getScopesArray(SCOPES.PROPERTY.GET.User)
                }
            ],
            distinct: true,
            attributes: []
        })

        const formattedFavoritesList = favoritesList.map((favorite) => favorite.propertyInfo)
        return { count, favoritesList: formattedFavoritesList }
    } catch (error) {
        throw new BadRequestError(ERROR_MESSAGES.FAVORITES_LIST.GET_FAVORITES_LIST)
    }
}

const updateFavoriteProperty = async ({ userId, propertyId }) => {
    const transaction = await db.sequelize.transaction()

    try {
        const property = await db.Properties.findOne({
            where: { propertyId }
        })
        if (!property) {
            throw new NotFoundError(ERROR_MESSAGES.PROPERTY.NOT_FOUND)
        }

        const [newFavoriteProperty, created] = await db.FavoriteProperties.findOrCreate({
            where: { userId, propertyId },
            transaction
        })
        if (created) {
            if (property.status !== PROPERTY_STATUS.AVAILABLE) {
                throw new BadRequestError(ERROR_MESSAGES.FAVORITES_LIST.PROPERTY_NOT_AVAILABLE)
            }
        } else {
            return db.FavoriteProperties.destroy({ where: { userId, propertyId } })
        }

        if (!newFavoriteProperty) {
            throw new BadRequestError(ERROR_MESSAGES.FAVORITES_LIST.FAILED_TO_ADD_TO_FAVORITES_LIST)
        }

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            throw error
        }
        throw new BadRequestError(ERROR_MESSAGES.FAVORITES_LIST.UPDATE_FAVORITE_PROPERTY)
    }
}

module.exports = {
    updateFavoriteProperty,
    getFavoritesList
}
