module.exports = (app) => {
  const auth = require("../middlewares/auth");

  const jobs = require("../controllers/urgent.controller.js");

  var router = require("express").Router();

  router.get("/count", jobs.countUrgent);
  router.post("/", jobs.createUrgent);
  router.get("/", jobs.findUrgent);

  app.use("/feature", auth, router);
};
