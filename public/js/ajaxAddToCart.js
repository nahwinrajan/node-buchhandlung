$("[name='btn-add-to-cart']").click(function(e){
  e.preventDefault();
  var bookId = $(this).attr("data-id");
  let _data = { id: bookId };
  $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/addtocart',
      data: _data,
      dataType: 'application/json',
  });
});
