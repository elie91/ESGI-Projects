const Router = require('express').Router;

module.exports = app => {
  let router = new Router();

  router.get('/', app.actions.users.getUsers)
  router.post('/', app.actions.users.createUser)
  router.get('/:id', app.actions.users.getUser)
  router.put('/:id',
    app.middlewares.verifyToken(app, 'ROLE_USER'),
    app.actions.users.updateUser
  )
  router.delete('/:id', app.actions.users.deleteUser)


  return router;
};
