module.exports = app => {

  const auth = require("../middlewares/auth");

  const messages = require("../controllers/messages.controller.js");

  var router = require("express").Router();

  router.get("/count", messages.countMyMessage);
  router.post("/", messages.createMessage);
  router.get("/", messages.findMessages);
  router.get("/users", messages.findConversation);

  app.use("/messages", auth, router);

};