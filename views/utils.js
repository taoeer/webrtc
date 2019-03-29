function reportError(errMessage) {
  log_error("Error " + errMessage.name + ": " + errMessage.message);
}

function log_error(text) {
  var time = new Date();

  console.error("[" + time.toLocaleTimeString() + "] " + text);
}

function log(text) {
  var time = new Date();

  console.log("[" + time.toLocaleTimeString() + "] " + text);
}