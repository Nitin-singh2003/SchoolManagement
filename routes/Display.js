var express = require('express');
var router = express.Router();
var pool = require('./pool');
const bodyParser = require("body-parser");

// Middleware to parse JSON bodies (if needed)
router.use(bodyParser.json());

// Render the DisplaySchool page
router.get('/listschool', function(req, res, next) {
  res.render('DisplaySchool', { title: 'Surya' });
});

// List Schools API
router.get('/listSchools', function (req, res) {
  const userLat = parseFloat(req.query.latitude); // User's latitude from the request
  const userLon = parseFloat(req.query.longitude); // User's longitude from the request

  // Validate latitude and longitude
  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ message: 'Invalid latitude or longitude' });
  }

  // Query to get all schools from the database
  pool.query('SELECT id, name, address, latitude, longitude FROM schools', function (error, results) {
    if (error) {
      console.error('Database query error:', error); // Log the error for debugging
      return res.status(500).json({ message: 'Server Error' });
    }

    // Ensure there are schools to process
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No schools found' });
    }

    // Calculate the distance for each school and add it to the result
    const schoolsWithDistance = results.map(school => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    });

    // Sort schools by distance (ascending)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    // Return the sorted schools list
    res.status(200).json(schoolsWithDistance);
  });
});

// Haversine formula to calculate the distance between two geo coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);  // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;  // Distance in kilometers
}

module.exports = router;