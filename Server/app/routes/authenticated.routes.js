module.exports = app => {

  const auth = require("../middlewares/auth");

  const authenticated = require("../controllers/authenticated.controller.js");

  var router = require("express").Router();

  router.put("/:document/", authenticated.updateProfile);

  router.put("/:document/password", authenticated.updatePassword);

  router.get("/:document/download", authenticated.download);

  app.use("/authenticated/",auth, router);

};