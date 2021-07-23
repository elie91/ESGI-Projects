const Router = require('express').Router;
const upload = require('../helpers/multer');

module.exports = app => {
    let router = new Router();
    router.get('/',
      app.middlewares.verifyToken(app, null, true),
      app.actions.videos.getVideos
    );
    router.get('/following',
        app.middlewares.verifyToken(app, null),
        app.actions.videos.getVideosFollowed
    );
    router.post('/',
        app.middlewares.verifyToken(app, 'ROLE_PLAYER'),
        upload.any(),
        app.actions.videos.createVideo
    );
    router.post('/:id/views',
        app.middlewares.verifyToken(app, null, true),
        app.actions.videos.addVideoView
    );
    router.post('/:id/likes',
        app.middlewares.verifyToken(app, null),
        app.actions.videos.likeVideo
    );
    router.post('/:id/follows',
        app.middlewares.verifyToken(app, null),
        app.actions.videos.followPlayer
    );

    router.get('/:id/comments',
        app.actions.videos.getVideoComments
    );
    router.post('/:id/comments',
        app.middlewares.verifyToken(app, ['ROLE_USER', 'ROLE_PLAYER']),
        app.actions.videos.commentVideo
    );
    router.get('/:id/play',
        app.actions.videos.startStreaming
    );
    router.get('/:id',
        app.middlewares.verifyToken(app, null, true),
        app.actions.videos.getVideo
    );
    router.put('/:id',
        app.middlewares.verifyToken(app, 'ROLE_PLAYER'),
        app.actions.videos.updateVideo
    );
    router.delete('/:id',
        app.middlewares.verifyToken(app, 'ROLE_PLAYER'),
        app.actions.videos.deleteVideo
    );

    return router;
};
