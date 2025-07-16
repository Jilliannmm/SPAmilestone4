 let viewMode = "grid";
let searchHistory = [];

function renderBooks(books, targetDivId) {
  const target = $(targetDivId);
  target.empty().removeClass("grid list").addClass(viewMode);

  books.forEach(book => {
    const bookData = {
      id: book.id,
      title: book.volumeInfo.title,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || ''
    };
    target.append(Mustache.render(templates.bookCard, bookData));
  });
}

function getBookDetails(bookId) {
  $.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`, data => {
    const bookData = {
      title: data.volumeInfo.title,
      thumbnail: data.volumeInfo.imageLinks?.thumbnail || '',
      authors: data.volumeInfo.authors?.join(', ') || 'N/A',
      description: data.volumeInfo.description || 'No description available.'
    };
    $("#bookDetails").html(Mustache.render(templates.bookDetail, bookData));
  });
}

function searchBooks(term) {
  updateSearchHistory(term);

  $.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=40`, res => {
    if (!res.items) {
      $("#resultsView").html("<p>No results found.</p>");
      return;
    }

    setupPagination(res.items);
  });
}

function setupPagination(items) {
  $("#pagination").empty();

  const pageSize = 10;
  const pageCount = Math.ceil(items.length / pageSize);

  for (let i = 0; i < pageCount; i++) {
    $("<button>").text(i + 1).on("click", () => {
      const pageItems = items.slice(i * pageSize, (i + 1) * pageSize);
      renderBooks(pageItems, "#resultsView");
    }).appendTo("#pagination");
  }

  renderBooks(items.slice(0, pageSize), "#resultsView");
}

function updateSearchHistory(term) {
  if (!searchHistory.includes(term)) {
    searchHistory.unshift(term);
    if (searchHistory.length > 5) searchHistory.pop();
    renderSearchHistory();
  }
}

function renderSearchHistory() {
  $("#searchHistory").empty();
  searchHistory.forEach(term => {
    $("<button>").text(term).on("click", () => searchBooks(term)).appendTo("#searchHistory");
  });
}

function loadPublicBookshelf() {
  const url = "https://www.googleapis.com/books/v1/users/105314797716233295291/bookshelves/1001/volumes";

  $.get(url, (res) => {
    $("#bookshelfView").empty();
    if (!res.items || res.items.length === 0) {
      $("#bookshelfView").append("<p>No books found in the public shelf.</p>");
      return;
    }

    renderBooks(res.items, "#bookshelfView");
  });
}

$(document).ready(() => {
  $("#searchBtn").click(() => {
    const term = $("#searchBox").val().trim();
    if (term) searchBooks(term);
  });

  $("#gridBtn").click(() => {
    viewMode = "grid";
    $("#resultsView, #bookshelfView").removeClass("list").addClass("grid");
  });

  $("#listBtn").click(() => {
    viewMode = "list";
    $("#resultsView, #bookshelfView").removeClass("grid").addClass("list");
  });

  $("#resultsView").on("click", ".book", function () {
    const id = $(this).data("id");
    getBookDetails(id);
  });

  $("#bookshelfView").on("click", ".book", function () {
    const id = $(this).data("id");
    getBookDetails(id);
  });

  loadPublicBookshelf();
  renderSearchHistory();
});
