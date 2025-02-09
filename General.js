const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// ✅ Task 6: Register a new user (Moved to general.js)
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// ✅ Task 1: Get all books
public_users.get('/', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    res.status(200).json({ books });
});

// ✅ Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    new Promise((resolve, reject) => {
        resolve(books[req.params.isbn]);
    }).then(book => book ? res.status(200).json(book) : res.status(404).json({ message: "Book not found" }));
});

// ✅ Task 3: Get books by Author
public_users.get('/author/:author', (req, res) => {
    new Promise((resolve) => {
        resolve(Object.values(books).filter(book => book.author === req.params.author));
    }).then(result => result.length > 0 ? res.status(200).json(result) : res.status(404).json({ message: "No books found by this author" }));
});

// ✅ Task 4: Get books by Title
public_users.get('/title/:title', (req, res) => {
    new Promise((resolve) => {
        resolve(Object.values(books).filter(book => book.title.toLowerCase() === req.params.title.toLowerCase()));
    }).then(result => result.length > 0 ? res.status(200).json(result) : res.status(404).json({ message: "No books found with this title" }));
});

// ✅ Task 5: Get book review
public_users.get('/review/:isbn', async (req, res) => {
    new Promise((resolve) => {
        resolve(books[req.params.isbn]?.reviews);
    }).then(reviews => reviews ? res.status(200).json(reviews) : res.status(404).json({ message: "No reviews found" }));
});

// ✅ Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// ✅ Task 11: Get book by ISBN using Axios and Promises
public_users.get('/async/isbn/:isbn', (req, res) => {
    axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({ message: "Book not found" }));
});

// ✅ Task 12: Get books by Author using Axios and Promises
public_users.get('/async/author/:author', (req, res) => {
    axios.get(`http://localhost:5000/author/${req.params.author}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({ message: "No books found by this author" }));
});

// ✅ Task 13: Get books by Title using Axios and Promises
public_users.get('/async/title/:title', (req, res) => {
    axios.get(`http://localhost:5000/title/${req.params.title}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({ message: "No books found with this title" }));
});

module.exports.general = public_users;
