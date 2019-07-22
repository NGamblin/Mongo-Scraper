
function getArticles (){
  $(".collection").empty();

  $.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {

    $(".collection").prepend("<li class='collection-item'>"+ data[i].title +"<br> <a data-id='" + data[i]._id + "' class='waves-effect waves-light btn-small save-button'><i class='material-icons left'>favorite</i>Save</a>  <a data-id='" + data[i]._id + "' class='waves-effect waves-light btn-small note-button'><i class='material-icons left'>notes</i>Notes</a></li>");

  }
});
};

$( "#scrape_button" ).click(function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
})
    .then(function (data) {
        console.log(data);
        getArticles();
        }
)});



$("body").on('click', '.note-button', function () {
  $("#notes").empty();
//   // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId)

//   // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});



// When you click the savenote button
$("body").on('click', '#savenote', function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
getArticles();


