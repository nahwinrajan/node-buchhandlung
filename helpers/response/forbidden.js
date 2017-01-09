/**
 * 403 (Forbidden) Handler
 *
 * a specific 403 handler for unified and centered error handling
 * inspired by sails structure. well this is just proof of concept so nothing
 * i keep it at minimal
 *
 */
module.export = function forbidden(err, req, res, customErrorMessage) {

  if (res === undefined || req === undefined) {
    return new Error("invalid request or response argument");
  }
  // Set status code
  res.status(403);

  // Log error to console
  if (data !== undefined) {
    console.log('Sending 403 ("Forbidden") response: \n', err);
  }
  else console.log('Sending 403 ("Forbidden") response');

  // supposedly we check which response format is requested (html, json, file)
  res.render("403.html");
};
