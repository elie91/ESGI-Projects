module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /*
      Add altering commands here.

      Example:
      await queryInterface.addColumn('User', 'lastname', { type: Sequelize.DataTypes.STRING(150) }, { transaction });
      */
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /*
      Add reverting commands here.

      Example:
      await queryInterface.removeColumn('User', 'firstname', { transaction });
      await transaction.commit();
      */
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
