
//Get Articles from the DB

function getArticles (){
  $("#articles_main_heading").empty();
  $("#articles_main_heading").append("Mongo Scraper");
  $(".collection").empty();
  $("#notes").empty();
  $.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {

    $(".collection").prepend("<li class='collection-item'>"+ data[i].title +"<br> <a data-id='" + data[i]._id + "' class='waves-effect waves-light btn-small save-button'><i class='material-icons left'>favorite</i>Save</a>  <a data-id='" + data[i]._id + "' class='waves-effect waves-light btn-small note-button'><i class='material-icons left'>notes</i>Notes</a></li>");

  }
});
};


//Get saved Articles from the DB

function getSavedArticles (){
  $("#articles_main_heading").empty();
  $("#articles_main_heading").append("Saved Articles");
  $(".collection").empty();
  $("#notes").empty();

  $.getJSON("/articles/saved", function(data) {
  for (var i = 0; i < data.length; i++) {
    $(".collection").prepend("<li class='collection-item'>"+ data[i].title +"<br> <a data-id='" + data[i]._id + "' class='waves-effect waves-light btn-small save-button'><i class='material-icons left'>favorite</i>Save</a>  <a data-id='" + data[i]._id + "' class='waves-effect waves-light btn-small note-button'><i class='material-icons left'>notes</i>Notes</a></li>");

  }
});
};


//Scrape new articles into the DB and then display all articles fom the DB
$( "#scrape_button" ).click(function() {

  $.ajax({
    method: "GET",
    url: "/scrape"
})
  .then(function (data) {
    $(".collection").empty();
    $("#notes").empty();
    console.log(data);
    getArticles();
  }
)});


//Display all saved Articles from the DB
$( "#saved_articles_button" ).click(function() {

  $.ajax({
    method: "GET",
    url: "/articles/saved"
})
  .then(function (data) {
    $(".collection").empty();
    $("#notes").empty();
    console.log(data);
    getSavedArticles();
  }
)});

//Get the note related to this article and display it

$("body").on('click', '.note-button', function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  console.log(thisId)

//   // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {

      console.log(data);

      $("#notes").append("<h5>" + data.title + "</h5>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data.note._id + "' id='deletenote'>Delete Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});


//Updated Article as saved to DB
$("body").on('click', '.save-button', function () {
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  })
    .then(function(data) {
      console.log(data);

    });
});



// When you click the savenote button
$("body").on('click', '#savenote', function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);

      $("#notes").empty();
    });

    $("#titleinput").val("");
  $("#bodyinput").val("");
});

$("body").on('click', '#deletenote', function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    url: "/note/delete/" + thisId,
    method: "DELETE"
  })
    .then(function(data) {
      console.log(data);

      $("#notes").empty();
    });

});


getArticles();


