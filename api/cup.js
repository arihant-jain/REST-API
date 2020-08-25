var express = require('express');
var createError = require('http-errors');
var validateCup = require('../validate/cup')
var dateTime = require('../common/datetime');
var router = express.Router();

// Load the MySQL pool connection
const pool = require('../db-config');
var table = 'CUP';

/* GET cups listing. */
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
      results.forEach(cup => {
        cup.created_at_melbourne_date_time = dateTime.utcToMelbourneTime(cup.created_at);
        cup.updated_at_melbourne_date_time = dateTime.utcToMelbourneTime(cup.updated_at);
      });
      res.send(results);
    });
  });
});

/* GET total number of cups added between 2 dates if supplied. Format accepted - YYYY/MM/DD */
router.get('/count', function(req, res, next) {

  startDate = (req.query.startDate)? dateTime.melbourneTimeToUTC(req.query.startDate) : null;
  endDate = (req.query.endDate) ? dateTime.melbourneTimeToUTC(req.query.endDate) : null;
  if(startDate == null){
    if(endDate == null){
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table
    }
    else{
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE created_at <= \'' + endDate + '\''
    }
  }
  else{
    if(endDate == null){
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE created_at >= \'' + startDate  + '\''
    }
    else{
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE created_at BETWEEN \'' + startDate + '\' AND \'' + endDate  + '\''
    }
  }
  console.log(sqlCommand)
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query(sqlCommand, function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(results);
      res.send(results);
    });
  });
});

// GET cups by id
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
      result.forEach(cup => {
        cup.created_at_melbourne_date_time = dateTime.utcToMelbourneTime(cup.created_at);
        cup.updated_at_melbourne_date_time = dateTime.utcToMelbourneTime(cup.updated_at);
      });
      res.send(result);
    });
  });
})

// POST to cup
router.post('/', function(req, res, next){
  
  // Validate cup id
  if(validateCup.checkId(req.body.id)){
    pool.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
    
      // Build query
      var query = 'INSERT INTO ' + table + ' VALUES (' + req.body.id +', \'' + req.body.size + '\', \'' + req.body.status + '\', ' + req.body.batch_id + ', current_timestamp(), null)';
      console.log(query);
      // Use the connection
      connection.query(query, function (error, result, fields) {
        // When done with the connection, release it.
        connection.release();
    
        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
        console.log(result);
        res.status(201).send(`{"message" : "Cup created with ID: ${req.body.id}"}`);
      });
    });
  }
  else{
    res.send(`{"message" : "Invalid Cup Id!"}`);
  }
})

// PUT (update) to a cup by id
router.put('/:id', function(req, res, next){

  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Build query
    var query = 'UPDATE ' + table + ' SET';
    query += (req.body.size != null ? ' size = \'' + req.body.size + '\',' : '');
    query += (req.body.status != null ? ' status = \'' + req.body.status + '\',' : '');
    query += (req.body.batch_id != null ? ' batch_id = ' + req.body.batch_id + ',' : '');
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
        res.send(`{"message" : "Cup updated successfully"}`);
      else if(result.changedRows == 0)
        res.send(`{"message" : "Cup not found. TO BE CHANGED AS AN ERROR!"}`);
      else 
        res.send(`{"message" : "${result.changedRows} rows updated. TO BE CHANGED AS AN ERROR!"}`);
    });
  });
});

// DELETE a cup by id
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
        res.send(`{"message" : "Cup deleted successfully"}`);
      else if(result.affectedRows == 0)
        res.send(`{"message" : "Cup not found. TO BE CHANGED AS AN ERROR!"}`);
      else 
        res.send(`{"message" : "${result.affectedRows} rows deleted. TO BE CHANGED AS AN ERROR!"}`);
    });
  });
});

module.exports = router;
