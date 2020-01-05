$(function() {
  $('#testForm1').submit(function(e) {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#testForm1').serialize(),
      success: function(data) {
        $('#jsonResult1').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  $('#testForm2').submit(function(e) {
    $.ajax({
      url: '/api/stock-prices',
      type: 'get',
      data: $('#testForm2').serialize(),
      success: function(data) {
        $('#jsonResult2').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
});
