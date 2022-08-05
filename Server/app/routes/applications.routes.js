module.exports = app => {

  const auth = require("../middlewares/auth");

  const applications = require("../controllers/applications.controller.js");

  var router = require("express").Router();

  router.get("/count/:status", applications.countApplications);
  router.post("/", applications.createApplications);
  router.get("/", applications.findApplications);
  router.get("/:status", applications.findApplications);

  app.use("/applications", auth, router);

};