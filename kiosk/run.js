const carlo = require("carlo");
const path = require("path");

const size = process.argv[2];
const port = process.env.NODE_PORT;

(async function() {
  const options = {
    userDataDir: path.join(__dirname, "/.profile"),
    args: ["--incognito"]
  };

  let isDev = false;
  if (size) {
    const [, width, height = height] = size.match(/^([0-9]+)(?:x([0-9]+))?$/);
    options.width = +width;
    options.height = +height;

    isDev = true;
    options.userDataDir += ".dev";
    options.args.push("--auto-open-devtools-for-tabs");
  }

  // https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#carlolaunchoptions
  const app = await carlo.launch(options);
  app.on("exit", () => process.exit());

  setTimeout(() => {
    app.evaluate(url => (location.href = url), `http://localhost:${port}`);
    if (!isDev) app.mainWindow().fullscreen();
  }, 1000);
})();
