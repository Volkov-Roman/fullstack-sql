const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('user_blogs', 'read', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('user_blogs', 'read')
  }
}
