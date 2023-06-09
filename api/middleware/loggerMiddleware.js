import morgan from "morgan";
import rfs from "rotating-file-stream";

const fileRotation = process.env.LOG_FILE_ROTATION;
const fileSize = process.env.LOG_FILE_SIZE;

const options = {
  // interval: fileRotation,
  size: fileSize,
  path: "./logs",
};

const pad = (num) => {
  return (num > 9 ? "" : "0") + num;
};

const generator = (time, index, name) => {
  if (!time) return name;

  const date =
    time.getFullYear() +
    "/" +
    pad(time.getMonth() + 1) +
    "/" +
    pad(time.getDate());

  return date + "-" + index + "-" + name;
};

// create a rotating write stream for each type of log
const errorLogStream = rfs.createStream(
  (time, index) => generator(time, index, "error.log"),
  options,
);

const debugLogStream = rfs.createStream(
  (time, index) => generator(time, index, "debug.log"),
  options,
);

const infoLogStream = rfs.createStream(
  (time, index) => generator(time, index, "info.log"),
  options,
);

const warnLogStream = rfs.createStream(
  (time, index) => generator(time, index, "warn.log"),
  options,
);

const combinedLogStream = rfs.createStream(
  (time, index) => generator(time, index, "combined.log"),
  options,
);

const requestLogStream = rfs.createStream(
  (time, index) => generator(time, index, "request.log"),
  options,
);

export const systemLogStream = rfs.createStream(
  (time, index) => generator(time, index, "system.log"),
  options,
);

// custom morgan tokens
morgan.token("status", (req, res) => {
  return res.statusCode;
});

morgan.token("ip", (req) => {
  return req.ip;
});

morgan.token("user-agent", (req) => {
  return req.get("User-Agent");
});

morgan.token("user", (req) => {
  return req.user ? req.user._id : null;
});

morgan.token("headers", (req) => {
  return JSON.stringify(req.headers);
});

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

morgan.token("referrer", (req) => {
  return req.header("referrer");
});

morgan.token("http-version", (req) => {
  return req.httpVersion;
});

morgan.token("query", (req) => {
  return JSON.stringify(req.query);
});

// setup the morgan middleware
const logger = morgan((tokens, req, res) => {
  let message = JSON.stringify({
    ip: tokens.ip(req),
    "user-agent": tokens["user-agent"](req),
    referrer: tokens.referrer(req),
    "http-version": tokens["http-version"](req),
    query: tokens.query(req),
    time: tokens.date(req, res, "iso"),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    user: tokens.user(req),
    headers: tokens.headers(req),
    body: tokens.body(req),
    status: tokens.status(req, res),
    "content-length": tokens.res(req, res, "content-length"),
    "response-time": tokens["response-time"](req, res),
  });

  switch (tokens.status(req, res)) {
    case "400":
    case "401":
    case "402":
    case "403":
    case "404":
    case "500":
      errorLogStream.write(message + "\n");
      break;

    case "200":
      infoLogStream.write(message + "\n");
      break;

    case "300":
    case "301":
    case "302":
      warnLogStream.write(message + "\n");
      break;

    default:
      debugLogStream.write(message + "\n");
      break;
  }
  console.log(message)
  combinedLogStream.write(message + "\n");
  requestLogStream.write(message + "\n");
});

// System events should be logged separately, where they occur
// Example usage:
// systemLogStream.write(`Application started at ${new Date().toISOString()}\n`);

export default logger;
