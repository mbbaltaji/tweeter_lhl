$(document).ready(function(){

  // handler that counts and tweet chars and dynamically changes the <output> element
  $('#tweet-text').on('input', function(e){
    let charCount = 140;
    let count = charCount - $(this).val().length; //$(this).val stores the string val in the textarea el
    let output = $(this).next().children()[1];

    //.next gets the next sibling of an element
    // .children returns an array pf children
    output.innerHTML = count;
    if (count < 0) {
      $(output).css('color', 'red');
    } else {
      $(output).css('color', 'grey');
    }
  });
});