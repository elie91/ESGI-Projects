const { createUser, updateUser, deleteUser } = require("./Mutations/mutationUser");
const { createEvent, updateEvent, deleteEvent } = require("./Mutations/mutationEvent");
const { createService, updateService, deleteService } = require("./Mutations/mutationService");
const { createOption, updateOption, deleteOption } = require("./Mutations/mutationOption");
const { createHome, updateHome, deleteHome } = require("./Mutations/mutationHome");
const { createPicture, updatePicture, deletePicture } = require("./Mutations/mutationPicture");
const { createRent } = require("./Mutations/mutationRent");
const { createEventUser } = require("./Mutations/mutationEventUser");
const { check_login, signup } = require("./auth");

const Mutation = {
  createUser,
  updateUser,
  deleteUser,
  check_login,
  signup,
  createEvent,
  updateEvent,
  deleteEvent,
  createService,
  updateService,
  deleteService,
  createOption,
  updateOption,
  deleteOption,
  createHome,
  updateHome,
  deleteHome,
  createPicture,
  updatePicture,
  deletePicture,
  createRent,
  createEventUser
};

module.exports = {
  Mutation,
};
