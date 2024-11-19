const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const { json } = require('express');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});


//Add the code for getting the list of books available in the shop (done in Task 1) using async-await with Axios.
public_users.get("/server/asynbooks", async function (req,res) {
  try {
    let response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting book list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book nםt found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.trim().toLowerCase();
    const bookRetrived = [];
  
    Object.values(books).forEach(book => {
        if (book.author.trim().toLowerCase() === author) {
          bookRetrived.push(book.title);
        }
      });
  
    if (bookRetrived.length > 0) {  
      res.send(bookRetrived);  
    } else {
      res.status(404).send(`No books found for ${author} author`);  
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.trim().toLowerCase();
    const bookRetrivedTitle = [];

    Object.values(books).forEach(book => {
        if (book.title.trim().toLowerCase() === title) {
            bookRetrivedTitle.push(book);
        }
      });
  
    if (bookRetrivedTitle.length > 0) {  
      res.send(bookRetrivedTitle);  
    } else {
      res.status(404).send(`No books found for ${title} title`);  
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });

module.exports.general = public_users;
