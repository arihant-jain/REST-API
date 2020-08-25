var express = require('express');
var dateTime = require('../common/datetime');
var router = express.Router();

// Load the MySQL pool connection
const pool = require('../db-config');
var table = 'BIN';

/* GET bins listing. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query('SELECT * FROM ' + table, function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(results);
      results.forEach(bin => {
        bin.created_at_melbourne_date_time = dateTime.utcToMelbourneTime(bin.created_at);
        bin.updated_at_melbourne_date_time = dateTime.utcToMelbourneTime(bin.updated_at);
      });
      res.send(results);
    });
  });
});

// GET a bin by id
router.get('/:id', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query('SELECT * FROM ' + table + ' WHERE id = ' + req.params.id, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      result.forEach(bin => {
        bin.created_at_melbourne_date_time = dateTime.utcToMelbourneTime(bin.created_at);
        bin.updated_at_melbourne_date_time = dateTime.utcToMelbourneTime(bin.updated_at);
      });
      res.send(result);
    });
  });
})

// POST to bin
router.post('/', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Build query
    var query = 'INSERT INTO ' + table + ' (latitude, longitude, level, created_at, updated_at) VALUES (' + req.body.latitude + ', ' + req.body.longitude + ', ' + req.body.level + ', current_timestamp(), null)';
    console.log(query);
    // Use the connection
    connection.query(query, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      res.status(201).send(`{"message" : "Bin added with ID: ${result.insertId}"}`);
    });
  });
})

// PUT (update) to a bin by id
router.put('/:id', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Build query
    var query = 'UPDATE ' + table + ' SET';
    query += (req.body.latitude != null ? ' latitude = ' + req.body.latitude + ',' : '');
    /* if(req.body.latitude != null && (req.body.longitude != null || req.body.level != null))
      query += ',' */
    query += (req.body.longitude != null ? ' longitude = ' + req.body.longitude + ',' : '');
    /* if(req.body.longitude != null && req.body.level != null)
      query += ',' */
    query += (req.body.level != null ? ' level = ' + req.body.level + ',' : '');
    query += ' updated_at = current_timestamp() WHERE id = ' + req.params.id;
    console.log(query);

    // Use the connection    
    connection.query(query, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      if(result.changedRows == 1)
        res.send(`{"message" : "Bin updated successfully"}`);
      else if(result.changedRows == 0)
        res.send(`{"message" : "Bin not found. TO BE CHANGED AS AN ERROR!"}`);
      else 
        res.send(`{"message" : "${result.changedRows} rows updated. TO BE CHANGED AS AN ERROR!"}`);
    });
  });
});

// DELETE a bin by id
router.delete('/:id', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Build query
    var query = 'DELETE FROM '+ table + ' WHERE id = ' + req.params.id;
    console.log(query);
    // Use the connection
    connection.query(query, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      if(result.affectedRows == 1)
        res.send(`{"message" : "Bin deleted successfully"}`);
      else if(result.affectedRows == 0)
        res.send(`{"message" : "Bin not found. TO BE CHANGED AS AN ERROR!"}`);
      else 
        res.send(`{"message" : "${result.affectedRows} rows deleted. TO BE CHANGED AS AN ERROR!"}`);
    });
  });
});

module.exports = router;
