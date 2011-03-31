
$(function(){
  $('#files a').click(function(){
    var url = $(this).attr('href');
    $.get(url, function(res){
      console.log(res);
    });
    return false;
  });
});