module.exports = (models, logger) => new Promise((resolve, reject) => {

    logger.info(`[platform-api][faker] Reset db`);

    for (const model in models) {
        models[model].destroy({truncate: {cascade: true}})
            // .then(logger.info(`[${model}] table deleted`))
            .catch((err) => {
                logger.error(`[platform-api][faker][${model}] Couldn't clear table `, err);
            })
        ;
    }

    resolve();
});
