var $form = $('#formPayment');

$(function() {
  $form.submit(function(event) {
    // Disable the submit button to prevent repeated clicks:
    $form.find('#btnSubmit').prop('disabled', true);

    // Request a token from Stripe:
    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from being submitted:
    return false;
  });
});

function stripeResponseHandler(status, response) {
  var $errBoard = $('#payment-errors');

  if(response.error) {
    // Show the errors on the form:
    $errBoard.text(response.error.message);
    $errBoard.removeClass('hidden');
    $form.find('#btnSubmit').prop('disabled', false); // Re-enable submission
  } else {
    var token = response.id;

    // Insert the token ID into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken">').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
}
