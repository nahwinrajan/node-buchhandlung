/**
 * 403 (Forbidden) Handler
 *
 * a specific 403 handler for unified and centered error handling
 * inspired by sails structure. well this is just proof of concept so nothing
 * i keep it at minimal
 *
 */
module.export = function serverError(err, req, res, customErrorMessage) {

  if (res === undefined || req === undefined) {
    return new Error("invalid request or response argument");
  }
  // Set status code
  res.status(500);

  // Log error to console
  if (data !== undefined) {
    sails.log.error('Sending 500 ("Server Error") response: \n',data);
  }
  else sails.log.error('Sending empty 500 ("Server Error") response');

  // supposedly we check which response format is requested (html, json, file)
  res.render("500.html")
};
