const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsTo(models.Roles, { foreignKey: 'roleId', as: 'role' })
            Users.hasMany(models.Properties, { foreignKey: 'userId' })
            Users.hasMany(models.FavoriteProperties, { foreignKey: 'userId', as: 'favoritesList' })
            Users.belongsTo(models.Wards, { foreignKey: 'wardCode', as: 'ward' })
            Users.belongsTo(models.Districts, { foreignKey: 'districtCode', as: 'district' })
            Users.belongsTo(models.Provinces, { foreignKey: 'provinceCode', as: 'province' })
            Users.hasMany(models.Tokens, { foreignKey: 'userId' })
            Users.hasMany(models.Contacts, { foreignKey: 'sellerId' })
            Users.hasMany(models.DepositsTransactions, { foreignKey: 'userId' })
            Users.hasMany(models.RentServiceTransactions, { foreignKey: 'userId' })
        }
    }
    Users.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            roleId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Roles',
                    key: 'roleId'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
                defaultValue: 1
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true
            },
            wardCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Wards',
                    key: 'wardCode'
                },
                allowNull: true
            },
            districtCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Districts',
                    key: 'districtCode'
                },
                allowNull: true
            },
            provinceCode: {
                type: DataTypes.STRING,
                references: {
                    model: 'Provinces',
                    key: 'provinceCode'
                },
                allowNull: true
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            isEmailVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0
            },
            emailVerificationCode: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Users'
        }
    )
    return Users
}
