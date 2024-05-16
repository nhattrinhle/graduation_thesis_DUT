/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Images', {
            imageId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            propertyId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Properties',
                    key: 'propertyId'
                },
                allowNull: false,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            imageUrl: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        })
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Images')
    }
}
