const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const config = require("./lib/config");
const drawbot = require("./lib/drawbot");
const drawSvgPath = require("./lib/draw-svg-path");

drawbot.setConfig(config.data);

app.use(express.static("frontend/dist"));

io.on("connection", function(socket) {
  // debug
  socket.use((packet, next) => {
    //console.log(packet);
    return next();
  });

  socket.on("updateConfig", cfg => drawbot.setConfig(config.update(cfg)));
  socket.on("getConfig", () => socket.emit("config", config.data));
  socket.on("moveBy", ({ x, y }) => drawbot.moveBy(x, y));
  socket.on("home", () => drawbot.home());
  socket.on("penUp", isUp => drawbot.penUp(isUp));
  socket.on("drawSvgPath", path => {
    drawSvgPath(path, drawbot.createSequence());
    drawbot.startSequence();
  });
});

["penUp", "moveTo", "lineTo"].forEach(event => {
  drawbot.addListener(event, payload => io.emit(event, payload));
});

server.listen(process.env.NODE_PORT, () => {
  const { port } = server.address();
  console.log(`server listen on port ${port}`);
});

const shutdown = () => {
  console.log("server stopped");
  server.close();
  process.exit(0);
};
process.on("SIGHUP", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGCONT", shutdown);
