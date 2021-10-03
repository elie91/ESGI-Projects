module.exports = (app, Sequelize) => {
    const Tag = {
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        deleted: {
            type: Sequelize.BOOLEAN(),
            defaultValue: false,
            allowNull: false,
        },
    };

    return app.sequelize.define("Tag", Tag, {
        ...app.config.database.model
    });
};
