module.exports = app => {

    const auth = require("../middlewares/auth");
  
    const jobs = require("../controllers/banner.controller.js");
  
    var router = require("express").Router();
  
    router.get("/count", jobs.countBanner);
    router.post("/", jobs.createBanner);
    router.get("/", jobs.findBanner);
  
    app.use("/banner", auth, router);
  
  };