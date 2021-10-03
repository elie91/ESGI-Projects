
module.exports = (app) => {

    const TagModel = app.sequelize.models.Tag;

    return {
        getTags
    };

    function getTags(req, res, next) {
        return TagModel.findAll({
            where: {
                deleted: false,
            },
        }).then((data) => {
            res.json(data);
        }).catch((err) => console.log(err) || res.sendStatus(500));
    }
}