const carlo = require("carlo");
const path = require("path");

const size = process.argv[2];
const port = process.env.NODE_PORT;

const DEBUG_PORT = 9221;

// https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#carlolaunchoptions
const options = {
  userDataDir: path.join(__dirname, "/.profile"),
  args: ["--incognito", `--remote-debugging-port=${DEBUG_PORT}`]
};

if (size) {
  const [, width, height = height] = size.match(/^([0-9]+)(?:x([0-9]+))?$/);
  options.width = +width;
  options.height = +height;
}
const isFullscreen = !!size;

(function run() {
  carlo.launch(options).then(
    app => {
      app.on("exit", () => {
        console.log("kiosk exits");
        run();
      });

      setTimeout(() => {
        app.evaluate(url => (location.href = url), `http://localhost:${port}`);
        if (!size) app.mainWindow().fullscreen();
      }, 1000);
    },
    () => {
      console.log("kiosk dies");
      run();
    }
  );
})();
