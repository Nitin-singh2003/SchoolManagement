var express = require('express');
var router = express.Router();
var pool = require('./pool');
const bodyParser = require("body-parser");

// Middleware to parse JSON and URL-encoded bodies
router.use(bodyParser.json());  // For parsing application/json
router.use(bodyParser.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

// // Home route (for testing or rendering the initial page)
router.get('/addschool', function (req, res, next) {
  res.render("school", { title: 'School' });
});



// Submit route for inserting school data
router.post('/addschool', function (req, res) {
  // res.render("School", { title: 'School' });
  console.log("Request Body:", req.body);

  // Validate if all fields are present
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.render('School', { message: 'All fields are required.' });
  }

  // Insert into the database
  pool.query(
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
    [name, address, latitude, longitude],
    function (error, result) {
      if (error) {
        console.log(error);
        return res.render('School', { message: 'Server Error' });
      } else {
        return res.render('School', { message: 'Record Submitted Successfully' });
      }
    }
  );
});

module.exports = router;
