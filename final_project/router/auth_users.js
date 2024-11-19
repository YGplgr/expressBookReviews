const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];



const isValid = (username) => {
    return users.some(user => user.username === username);
  };

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};


//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if (authenticatedUser && isValid) {
        // Generate JWT access token
        const token = jwt.sign({
            data: password
        }, 'your_jwt_secret_key', { expiresIn: 60 * 60 });

        // Store access token and username in session
        res.setHeader("Authorization", `Bearer ${token}`);
        req.session.username = username;
        req.session.token = token;

        return res.json({message: "Login successful."});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; 
  const username = req.session.username;

  if (!review || !username ) {
    return res.status(400).json({ message: "Review or username cannot be empty" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "ISBN ${isbn} not found" });
  }

  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review; 
    return res.status(200).json({ message: "Review updated successfully", reviews: books[isbn].reviews });
  }
  else {
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully", reviews: books[isbn].reviews });
  }


});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; 
    const username = req.session.username;

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
