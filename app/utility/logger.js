// import Bugsnag from "@bugsnag/expo";
// const log = (error) => Bugsnag.notify(error);
// const start = () => Bugsnag.start();

const LOG_PREFIX = "\x1b[33mLogger: \x1b[0m";
const clog = console.log;

const log = function () {
  // 1. Convert args to a normal array
  var args = Array.from(arguments);
  // OR you can use: Array.prototype.slice.call( arguments );

  // 2. Prepend log prefix log string
  args.unshift(LOG_PREFIX);
  // append style

  // 3. Pass along arguments to console.log
  clog.apply(console, args);
};

// most external tools need this.
const start = () => {};

export default { log, start };
