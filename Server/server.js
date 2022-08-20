const express = require("express");
const cors = require("cors");

const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: [
    "http://localhost:4200",
  ]
};

var corsOptions = {
  origin: "*",
};

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.log("Cannot connect to the database!", error.message);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

require("./app/routes/admin.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/authenticated.routes")(app);
require("./app/routes/crud.routes")(app);
require("./app/routes/jobs.routes")(app);
require("./app/routes/applications.routes")(app);
require("./app/routes/messages.routes")(app);

io.on("connection", (socket) => {
  console.log("a user connected!", socket.id);

  socket.on("message", (message) => {
    io.emit("message", `${JSON.stringify(message)}`);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
