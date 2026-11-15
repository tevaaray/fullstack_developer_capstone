const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Регистрация нового пользователя
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register user. Username and password are required."});
});

// Получение списка всех книг
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Получение информации о книге по ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Получение книг по автору
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksbyauthor = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksbyauthor.push({"isbn": key, ...books[key]});
    }
  });
  if (booksbyauthor.length > 0) {
    return res.status(200).json({booksbyauthor});
  } else {
    return res.status(404).json({message: "Books by this author not found"});
  }
});

// Получение книг по названию
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksbytitle = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksbytitle.push({"isbn": key, ...books[key]});
    }
  });
  if (booksbytitle.length > 0) {
    return res.status(200).json({booksbytitle});
  } else {
    return res.status(404).json({message: "Books with this title not found"});
  }
});

// Получение отзывов о книге по ISBN
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// ==========================================
// Реализация через Axios с async/await (для задач 10-13)
// ==========================================

const baseURL = "http://localhost:5000";

// Получение всех книг с использованием Async/Await и Axios
async function getAllBooksAsync() {
  try {
    const response = await axios.get(`${baseURL}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Получение книги по ISBN с использованием Axios
async function getBookByISBNAsync(isbn) {
  try {
    const response = await axios.get(`${baseURL}/isbn/${isbn}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Получение книг по автору с использованием Axios
async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(`${baseURL}/author/${author}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Получение книг по названию с использованием Axios
async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get(`${baseURL}/title/${title}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports.general = public_users;