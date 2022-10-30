const bookHeaderForm = document.querySelector(".book-header-form");
const bookSearchInput = document.querySelector(".book-search-input");
const savedBookList = document.querySelector(".saved-books-list");
const savedBookBtn = document.querySelector(".open-saved-btn");
const booksSelection = document.querySelector(".books-selection");
const booksSelectionLanguage = document.querySelector(
  ".books-selection-language"
);
const bookSearchYearInput = document.querySelector(".book-year-sort-input");
const bookSearchYearBtn = document.querySelector(".search-year-btn");
const bookSearchLanguageBtn = document.querySelector(
  ".search-book-language-btn"
);
const bookFilterForm = document.querySelector(".book-form");
const filterBookBtn = document.querySelector(".filter-book-btn");
const notFoundBox = document.querySelector(".not-found-books");
const bookTemplate = document.querySelector(".book-template").content;
const bookList = document.querySelector(".book-list");
const swiperBox = document.querySelector(".swiper-box");
const swiperList = document.querySelector(".swiper-list");

let bookMarkArr = JSON.parse(window.localStorage.getItem("bookmark")) || [];

// ! Randomize main array
booksMainRandomized = books
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

// ! Search Book Form
function searchBookSubmit(evt) {
  evt.preventDefault();
  swiperBox.classList.add("d-none");
  const searchElement = new RegExp(bookSearchInput.value.trim(), "gi");
  const searchBookFilteredList = books.filter((item) =>
    item.title.match(searchElement)
  );
  bookRender(searchBookFilteredList);
  if (searchBookFilteredList.length > 0) {
    bookRender(searchBookFilteredList, searchElement);
  } else {
    notFoundBox.classList.remove("d-none");
  }
}
bookHeaderForm.addEventListener("submit", searchBookSubmit);

// ! Main book card create <li> and appenChild to <ul>
function bookRender(books, titleRegex = "") {
  bookList.innerHTML = "";
  const bookFragment = document.createDocumentFragment();

  for (const book of books) {
    let cloneBookTemplate = bookTemplate.cloneNode(true);

    // ! Search by name and highlight searched letter
    if (titleRegex.source !== "(?:)" && titleRegex) {
      cloneBookTemplate.querySelector(".book-card-title").innerHTML =
        book.title.replace(
          titleRegex,
          `<mark class="p-0 bg-warning">${titleRegex.source}</mark>`
        );
    } else {
      cloneBookTemplate.querySelector(".book-card-title").textContent =
        book.title;
    }

    cloneBookTemplate.querySelector(".book-info-img").src = book.imageLink;
    cloneBookTemplate.querySelector(
      ".book-card-country"
    ).textContent = `${book.country}`;
    cloneBookTemplate.querySelector(
      ".book-card-author"
    ).textContent = `${book.author}`;
    cloneBookTemplate.querySelector(
      ".book-card-language"
    ).textContent = `${book.language}`;
    cloneBookTemplate.querySelector(
      ".book-card-year"
    ).textContent = `${book.year}`;
    cloneBookTemplate.querySelector(
      ".book-card-pages"
    ).textContent = `${book.pages}`;
    cloneBookTemplate.querySelector(".book-card-more-info-link").href =
      book.link;

    cloneBookTemplate.querySelector(".book-save-btn").dataset.bookmarkBtnId =
      book.link;

    bookFragment.appendChild(cloneBookTemplate);
  }
  bookList.appendChild(bookFragment);
}
bookRender(booksMainRandomized);

// ! Second Form, Filter form: a-z, z-a, years, pages and etc
function showSearchBooks() {
  swiperBox.classList.add("d-none");
  return books.filter((book) => {
    const meetsCriteria =
      (booksSelection.value === "all" || booksSelection.value) &&
      (booksSelectionLanguage.value === "all" ||
        book.language.includes(booksSelectionLanguage.value)) &&
      (bookSearchYearInput.value.trim() === "" ||
        book.year >= Number(bookSearchYearInput.value));
    return meetsCriteria;
  });
}

// ! Sort by Selection
function sortBooks(sortedArr, sortType) {
  if (sortType === "a-z") {
    sortedArr.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
  } else if (sortType === "z-a") {
    sortedArr.sort((a, b) => b.title.charCodeAt(0) - a.title.charCodeAt(0));
  } else if (sortType === "year-new-old") {
    sortedArr.sort((a, b) => b.year - a.year);
  } else if (sortType === "year-old-new") {
    sortedArr.sort((a, b) => a.year - b.year);
  } else if (sortType === "pages-to-high") {
    sortedArr.sort((a, b) => a.pages - b.pages);
  } else if (sortType === "pages-to-low") {
    sortedArr.sort((a, b) => b.pages - a.pages);
  }
}

// ! Sort by Language in Select Options
const bookLanguages = [];
function sortBooksLanguage() {
  books.forEach((book) => {
    const itemBookLanguage = book.language;
    if (!bookLanguages.includes(itemBookLanguage)) {
      bookLanguages.push(itemBookLanguage);
      itemBookLanguage.toString();
    }
  });
  bookLanguages.sort();
}
sortBooksLanguage();

const selectLanguageFragment = document.createDocumentFragment();
bookLanguages.forEach((option) => {
  const newBookLanguageOption = document.createElement("option");
  newBookLanguageOption.textContent = option;
  newBookLanguageOption.value = option;
  selectLanguageFragment.appendChild(newBookLanguageOption);
});
booksSelectionLanguage.appendChild(selectLanguageFragment);

// ! Second Form Event
bookFilterForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const searchBookFilteredList = showSearchBooks();

  sortBooks(searchBookFilteredList, booksSelection.value);
  bookRender(searchBookFilteredList);
});

// ! Add Saved List, chosen books
bookList.addEventListener("click", (evt) => {
  if (evt.target.matches(".book-save-btn")) {
    let itemBookMarkId = evt.target.dataset.bookmarkBtnId;
    let itemBook = books.find((item) => item.link == itemBookMarkId);
    if (!bookMarkArr.includes(itemBook)) {
      bookMarkArr.unshift(itemBook);
    }
    evt.target.classList.add("book-save-btn--saved");
    window.localStorage.setItem("bookmark", JSON.stringify(bookMarkArr));
  }
});

// ! Save btn
savedBookBtn.addEventListener("click", () => {
  savedBooks();
});

// ! Create elements in saved list, and appenChild it to saved list
const savedBookFragment = new DocumentFragment();
function savedBooks() {
  savedBookList.innerHTML = "";
  bookMarkArr.forEach((item) => {
    let savedItem = document.createElement("li");
    savedItem.classList.add("saved-book-item");

    let savedItemMainBox = document.createElement("div");
    savedItemMainBox.classList.add("saved-item-main-box");

    let savedItemImg = document.createElement("img");
    savedItemImg.classList.add("saved-item-img");
    savedItemImg.src = item.imageLink;

    let savedItemTitle = document.createElement("h3");
    savedItemTitle.classList.add("book-card-title");
    savedItemTitle.textContent = item.title;

    let savedItemAuthor = document.createElement("p");
    savedItemAuthor.classList.add("book-card-author");
    savedItemAuthor.textContent = item.author;

    let savedItemBoxInfo = document.createElement("div");
    savedItemBoxInfo.classList.add("saved-item-box-info");

    let savedItemPages = document.createElement("p");
    savedItemPages.classList.add("book-card-pages");
    savedItemPages.textContent = item.pages;

    let savedItemCountry = document.createElement("p");
    savedItemCountry.classList.add("book-card-country");
    savedItemCountry.textContent = item.country;

    let savedItemLanguage = document.createElement("p");
    savedItemLanguage.classList.add("book-card-language");
    savedItemLanguage.textContent = item.language;

    let savedItemDeleteBtn = document.createElement("button");
    savedItemDeleteBtn.classList.add("saved-item-delete-btn");
    savedItemDeleteBtn.type = "button";
    savedItemDeleteBtn.dataset.deleteBtnId = item.link;
    savedItemDeleteBtn.textContent = "Delete";

    savedItemBoxInfo.appendChild(savedItemLanguage);
    savedItemBoxInfo.appendChild(savedItemCountry);
    savedItemBoxInfo.appendChild(savedItemPages);

    savedItemMainBox.appendChild(savedItemImg);
    savedItemMainBox.appendChild(savedItemTitle);
    savedItemMainBox.appendChild(savedItemAuthor);
    savedItemMainBox.appendChild(savedItemBoxInfo);
    savedItemMainBox.appendChild(savedItemDeleteBtn);

    savedItem.append(savedItemMainBox);
    savedBookFragment.appendChild(savedItem);
  });
  savedBookList.appendChild(savedBookFragment);
}

// ! Delete saved item in saved list
savedBookList.addEventListener("click", (evt) => {
  if (evt.target.matches(".saved-item-delete-btn")) {
    let deleteBtnId = evt.target.dataset.deleteBtnId;
    let deleteFindBtn = bookMarkArr.findIndex(
      (item) => item.link == deleteBtnId
    );
    bookMarkArr.splice(deleteFindBtn, 1);
    window.localStorage.setItem("bookmark", JSON.stringify(bookMarkArr));
    savedBooks();
  }
});

// ! Randomize again Slice items and execute it in swiper
booksSwiperRandomized = books
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);
  
let booksSliced = booksSwiperRandomized.slice(0, 15);

const swiperFragment = new DocumentFragment();
function swiperBooks() {
  swiperList.innerHTML = "";
  booksSliced.forEach((item) => {
    let swiperItem = document.createElement("li");
    swiperItem.classList.add("swiper-slide");
    swiperItem.classList.add("swiper-item");

    let swiperItemMainBox = document.createElement("div");
    swiperItemMainBox.classList.add("saved-item-main-box");

    let swiperItemImg = document.createElement("img");
    swiperItemImg.classList.add("saved-item-img");
    swiperItemImg.classList.add("swiper-item-img");
    swiperItemImg.src = item.imageLink;

    let swiperItemTitle = document.createElement("h3");
    swiperItemTitle.classList.add("book-card-title");
    swiperItemTitle.textContent = item.title;

    let swiperItemCountry = document.createElement("p");
    swiperItemCountry.classList.add("book-card-country");
    swiperItemCountry.textContent = item.country;

    let swiperItemBoxInfo = document.createElement("div");
    swiperItemBoxInfo.classList.add("saved-item-box-info");

    let swiperItemPages = document.createElement("p");
    swiperItemPages.classList.add("book-card-pages");
    swiperItemPages.textContent = item.pages;

    let swiperItemYear = document.createElement("p");
    swiperItemYear.classList.add("book-card-year");
    swiperItemYear.textContent = item.year;

    let swiperItemLanguage = document.createElement("p");
    swiperItemLanguage.classList.add("book-card-language");
    swiperItemLanguage.textContent = item.language;

    let swiperItemAuthor = document.createElement("p");
    swiperItemAuthor.classList.add("book-card-author");
    swiperItemAuthor.textContent = item.author;

    let swiperItemInfoBox = document.createElement("div");
    swiperItemInfoBox.classList.add("swiper-item-info-box");

    swiperItemBoxInfo.appendChild(swiperItemYear);
    swiperItemBoxInfo.appendChild(swiperItemLanguage);
    swiperItemBoxInfo.appendChild(swiperItemPages);

    swiperItemMainBox.appendChild(swiperItemImg);
    swiperItemInfoBox.appendChild(swiperItemTitle);
    swiperItemInfoBox.appendChild(swiperItemCountry);
    swiperItemInfoBox.appendChild(swiperItemBoxInfo);
    swiperItemInfoBox.appendChild(swiperItemAuthor);

    swiperItemMainBox.appendChild(swiperItemInfoBox);

    swiperItem.append(swiperItemMainBox);
    swiperFragment.appendChild(swiperItem);
  });
  swiperList.appendChild(swiperFragment);
}
swiperBooks();

const swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,
  centeredSlides: true,
  spaceBetween: 30,
  grabCursor: true,
  loop: true,
  autoplay: true,
});
