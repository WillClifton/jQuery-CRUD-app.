$(function () {
  // Crud application
  const form = $(".form");
  const inputTitle = $("#movieTitle");
  const inputDescription = $("#movieDescription");
  const list = $(".movie-list");
  const url = "http://localhost:3000";

  function loadMovies() {
    $.ajax({
      method: "GET",
      url: url + "/movies",
      dataType: "json",
    })
      .done(function (response) {
        list.empty();
        insertMovies(response);
      })
      .fail(function (error) {
        console.log(error);
      });
  }

  loadMovies();

  function insertMovies(movies) {
    movies.forEach(function (e) {
      const li = $(`<li class="movie">
<div class="movie-content">
            <h3 class="movie-title">${e.title}</h3>
            <p class="movie-description">${e.description}</p>
        </div>
        <button class="btn-edit" data-id="${e.id}">Edit</button>
        <button class="btn-delete" data-id="${e.id}">Delete</button>
    </li>`);
      list.append(li);
    });
  }

  function addMovie(title, description) {
    const film = {
      title: title,
      description: description,
    };
    $.ajax({
      method: "POST",
      url: url + "/movies",
      dataType: "json",
      data: film,
    })
      .done(function (response) {
        loadMovies();
      })
      .fail(function (error) {
        console.log(error);
      });
  }

  form.on("submit", function (e) {
    e.preventDefault();
    addMovie(inputTitle.val(), inputDescription.val());
    inputTitle.val("");
    inputDescription.val("");
  });

  function removeMovie(id) {
    $.ajax({
      method: "DELETE",
      url: url + "/movies/" + id,
      dataType: "json",
    })
      .done(function (response) {
        loadMovies();
      })

      .fail(function (error) {
        console.log(error);
      });
  }

  list.on("click", ".btn-delete", function () {
    const id = $(this).data("id");
    removeMovie(id);
  });

  function updateMovie(id, title, description) {
    const film = {
      title: title,
      description: description,
    };
    $.ajax({
      method: "PATCH",
      url: url + "/movies/" + id,
      dataType: "json",
      data: film,
    })
      .done(function (response) {
        loadMovies();
      })

      .fail(function (error) {
        console.log(error);
      });
  }

  list.on("click", ".btn-edit", function (e) {
    e.preventDefault();

    var titleToEdit = $(this).parent().find(".movie-title");
    var descriptionToEdit = $(this).parent().find(".movie-description");

    $(this).toggleClass("editable");

    if ($(this).hasClass("editable")) {
      var titleToEditText = titleToEdit.text();
      var descriptionToEditText = descriptionToEdit.text();

      titleToEdit.replaceWith(
        `<input type="text" class="movie-title" value="${titleToEditText}" />`
      );

      descriptionToEdit.replaceWith(
        `<input type="text" class="movie-description" value="${descriptionToEditText}" />`
      );

      $(this).text("Save");
    } else {
      var modId = $(this).data("id");
      var thisTitle = titleToEdit.val();
      var thisDesc = descriptionToEdit.val();

      titleToEdit.replaceWith(` <h3 class="movie-title">${thisTitle}</h3>`);
      descriptionToEdit.replaceWith(
        `<p class="movie-description">${thisDesc}</p>`
      );

      updateMovie(modId, thisTitle, thisDesc);
      $(this).text("Edit");
    }
  });
});
