module.exports = app => {

  const auth = require("../middlewares/auth");

  const admin = require("../controllers/admin.controller.js");

  var router = require("express").Router();

  router.get("/users/:user_type", admin.findsUsers);
  router.get("/count/users", admin.countUsers);
  router.get("/count/jobs", admin.countJobs);

  app.use("/admin/", auth, router);

};