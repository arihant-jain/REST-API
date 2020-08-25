var express = require('express');
var router = express.Router();
var validateSale = require('../validate/sale');
var validateCup = require('../validate/cup');
var countModule = require('../common/count');
var dateTimeModule = require('../common/datetime');

// Load the MySQL pool connection
const pool = require('../db-config');
var table = 'SALE';

/* GET sales listing. */
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
      results.forEach(record => {
        record.scanned_at_melbourne_date_time = dateTimeModule.utcToMelbourneTime(record.scanned_at);
        
        // for date time not inside object
        record.scanned_at_melbourne_date = dateTimeModule.utcToMelbourneTime(record.scanned_at).date;
        record.scanned_at_melbourne_time = dateTimeModule.utcToMelbourneTime(record.scanned_at).time;
      });
      res.send(results);
    });
  });
});

/* GET total number of sales between 2 dates if supplied. Format accepted - YYYY/MM/DD */
router.get('/count', function(req, res, next) {
  
  startDate = (req.query.startDate)? dateTimeModule.melbourneTimeToUTC(req.query.startDate) : null;
  endDate = (req.query.endDate) ? dateTimeModule.melbourneTimeToUTC(req.query.endDate) : null;
  
  if(startDate == null){
    if(endDate == null){
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table
    }
    else{
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE scanned_at <= \'' + endDate + '\''
    }
  }
  else{
    if(endDate == null){
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE scanned_at >= \'' + startDate  + '\''
    }
    else{
      sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE scanned_at BETWEEN \'' + startDate + '\' AND \'' + endDate  + '\''
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

// Sale per cafe per day
router.get('/salepercafeperday', function(req, res, next){
  console.log(req.body.name);
  var is_return_all = false;
  if(req.body.name == null){
    is_return_all = true;
  }
  else{
    var cafe_usernames = '(';
    if(Array.isArray(req.body.name)){
      for(var i = 0; i < req.body.name.length; i++){
        if(i < req.body.name.length - 1){
          cafe_usernames += '\'' + req.body.name[i] + '\', ';
        }
        else{
          cafe_usernames += '\'' + req.body.name[i] + '\')';
        }
      }
    }
    else{
      cafe_usernames += '\'' + req.body.name + '\')';
    }
    console.log(cafe_usernames);
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    // Manages timezone until Sunday, 4 April, 2021 3:00 am	AEDT
    var query = 'SELECT cafe_id, (SELECT cafe_name FROM CAFE WHERE id = cafe_id) as cafe_name, DATE(CONVERT_TZ(scanned_at,\'+00:00\', \
    IF(scanned_at < \'2019-04-06T16:00:00\', \'+11:00\', \
      IF(scanned_at >= \'2019-04-06T16:00:00\' AND scanned_at < \'2019-10-05T16:00:00\', \'+10:00\', \
        IF(scanned_at < \'2020-04-05T16:00:00\', \'+11:00\', \
          IF(scanned_at >= \'2020-04-05T16:00:00\' AND scanned_at < \'2020-10-03T16:00:00\', \'+10:00\', \'+11:00\') \
        ) \
      ) \
    ) \
    )) as \'date\', COUNT(*) as \'count\' FROM SALE '
    if(is_return_all == false){
      query += 'WHERE cafe_id in (SELECT id FROM CAFE WHERE name in ' + cafe_usernames + ')';
    }
    query += 'GROUP BY cafe_id, `date`';
    console.log(query);
    connection.query(query, function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(results);
      results.forEach(record => {
        record.melbourne_date = dateTimeModule.utcToMelbourneTime(record.date).date;
      });
      res.send(results);
    });
  });
});

router.get('/last', function(req, res, next){

  // validate count value
  if(countModule.checkCount(req.query.count)){
    count = req.query.count;
    console.log(count);
    pool.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
    
      // Use the connection
      
      connection.query('SELECT s.id, s.cafe_id, c.cafe_name, s.cup_id, s.scanned_at FROM (SELECT * FROM SALE ORDER BY scanned_at DESC LIMIT ' + count + ') s JOIN CAFE c ON s.cafe_id = c.id ORDER BY s.scanned_at DESC', function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
    
        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
        console.log(results);
        results.forEach(record => {
          record.scanned_at_melbourne_date_time = dateTimeModule.utcToMelbourneTime(record.scanned_at);

          // for date time not inside object
          record.scanned_at_melbourne_date = dateTimeModule.utcToMelbourneTime(record.scanned_at).date;
          record.scanned_at_melbourne_time = dateTimeModule.utcToMelbourneTime(record.scanned_at).time;
        });
        res.send(results);
      });
    });
  }
  else{
    res.status(400);
    res.send("Error: 'count' is either not specified or is not a number greater than zero!");
  }
});

// GET sale record by id
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
      result.forEach(record => {
        record.scanned_at_melbourne_date_time = dateTimeModule.utcToMelbourneTime(record.scanned_at);

        // for date time not inside object
        record.scanned_at_melbourne_date = dateTimeModule.utcToMelbourneTime(record.scanned_at).date;
        record.scanned_at_melbourne_time = dateTimeModule.utcToMelbourneTime(record.scanned_at).time;
      });
      res.send(result);
    });
  });
});

// POST a sale record
router.post('/', function(req, res, next){

  // Validate cup id
  if(validateCup.checkId(req.body.cup_id)){

    // Check repeated scan/duplicate cup id
    if(validateSale.checkDuplicate(req.body.cup_id) == false){

      pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        /* Begin transaction */
        connection.beginTransaction(function(err) {
          if (err) { throw err; }
          // Build query
          var query = 'INSERT INTO ' + table + ' (cup_id, cafe_id, scanned_at) VALUES (' + req.body.cup_id + ', ' + req.body.cafe_id + ', current_timestamp())';
          console.log(query);

          connection.query(query, function(err, result) {
            if (err) { 
              console.log('Rolling back...');
              connection.rollback(function() {
                throw err;
              });
            }
        
            const log = result.insertId;

            // Build query
            var query = 'UPDATE CUP SET status = \'B\' WHERE id = ' + req.body.cup_id + ';';
            console.log(query);
            connection.query(query, function(err, result) {
              if (err) { 
                console.log('Rolling back...');
                connection.rollback(function() {
                  throw err;
                });
              }  
              connection.commit(function(err) {
                if (err) { 
                  console.log('Rolling back...');
                  connection.rollback(function() {
                    throw err;
                  });
                }
                console.log('Transaction Completed Successfully.');
                // When done with the connection, release it.
                connection.release();

                // Don't use the connection here, it has been returned to the pool.
                console.log(result);
                res.status(201).send(`{"message" : "Sale recorded with ID: ${log}"}`);
              });
            });
          });
        });
        /* End transaction */
      });
    }
    else{
      res.send(`{"message" : "Repeated/Duplicate scan!"}`);
    }
  }
  else{
    res.send(`{"message" : "Invalid Cup Id!"}`);
  }
});

// PUT (update) to a sale record by id
router.put('/:id', function(req, res, next){

  // Validate cup id
  if(validateCup.checkId(req.body.cup_id)){

    // Convert to UTC time
    var utcTime = dateTimeModule.melbourneTimeToUTC(req.body.scanned_at);

    pool.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
    
      // Build query
      var query = 'UPDATE ' + table + ' SET';
      query += (req.body.cup_id != null ? ' cup_id = ' + req.body.cup_id : '');
      if(req.body.cup_id != null && (req.body.cafe_id != null || utcTime != null))
        query += ','
      query += (req.body.cafe_id != null ? ' cafe_id = ' + req.body.cafe_id : '');
      if(req.body.cafe_id != null && utcTime != null)
        query += ','
      query += (utcTime != null ? ' scanned_at = \'' + utcTime + '\'' : '');
      query += ' WHERE id = ' + req.params.id;
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
          res.send(`{"message" : "Sale record updated successfully"}`);
        else if(result.changedRows == 0)
          res.send(`{"message" : "Sale record not found. TO BE CHANGED AS AN ERROR!"}`);
        else 
          res.send(`{"message" : "${result.changedRows} rows updated. TO BE CHANGED AS AN ERROR!"}`);
      });
    });
  }
  else{
    res.send(`{"message" : "Invalid Cup Id!"}`);
  }
});

// DELETE a sale record by id
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
        res.send(`{"message" : "Sale record deleted successfully"}`);
      else if(result.affectedRows == 0)
        res.send(`{"message" : "Sale record not found. TO BE CHANGED AS AN ERROR!"}`);
      else 
        res.send(`{"message" : "${result.affectedRows} rows deleted. TO BE CHANGED AS AN ERROR!"}`);
    });
  });
});

// POST the cached sale records
router.post('/cache/', function(req, res, next){

  // Empty body check
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    console.log('Array missing');
  }
  else {
    // Empty array check
    if(req.body.length != 0) {

      // sort by date time although we believe the records will already be sorted.
      sortedRecords = dateTimeModule.sortByDateTime(req.body);
      var filteredRecords = [];
      var duplicateRecords = [];
      for(var index = 0; index < sortedRecords.length; index++){
        var obj = sortedRecords[index];
        if(validateSale.checkCacheDuplicate(obj.cup_id, obj.scanned_at) == false){
          filteredRecords.push(obj);
        }
        else{
          duplicateRecords.push(obj);
        }
      }

      outputObject = {
        "inserted": null,
        "rejected": null,
        "duplicatesFound":null
      };

      pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        /* Begin transaction */
        connection.beginTransaction(function(err) {
          if (err) { throw err; }
          // Build query
          var query = 'INSERT INTO ' + table + ' (cup_id, cafe_id, scanned_at) VALUES ';
          secondQueryPart = '(';
          addedRecords = 0;
          rejectedRecords = 0;                    
          for(var index = 0; index < filteredRecords.length; index++){
            var obj = filteredRecords[index];
            if(validateCup.checkId(obj.cup_id)) {
              if(addedRecords > 0) {
                query += ',';
                secondQueryPart += ', ';
              }
              addedRecords += 1;
              query += '(' + obj.cup_id + ', ' + obj.cafe_id + ', \'' + dateTimeModule.melbourneTimeToUTC(obj.scanned_at) + '\')';
              secondQueryPart += obj.cup_id;
            }
            else{
              rejectedRecords += 1;
            }
            if(index == filteredRecords.length - 1) {
              query += ';';
              secondQueryPart += ');';
            }
          }
          if(rejectedRecords != filteredRecords.length){
            console.log(query);
            // Use the connection
            connection.query(query, function(err, result) {
              if (err) { 
                console.log('Rolling back...');
                connection.rollback(function() {
                  throw err;
                });
              }
              var insertedRecords = result.affectedRows;

              // Build query
              var query = 'UPDATE CUP SET status = \'B\' WHERE id IN ' + secondQueryPart;
              console.log(query);

              connection.query(query, function(err, result) {
                if (err) { 
                  console.log('Rolling back...');
                  connection.rollback(function() {
                    throw err;
                  });
                }  
                connection.commit(function(err) {
                  if (err) { 
                    console.log('Rolling back...');
                    connection.rollback(function() {
                      throw err;
                    });
                  }
                  console.log('Transaction Completed Successfully.');
                  // When done with the connection, release it.
                  connection.release();
      
                  // Don't use the connection here, it has been returned to the pool.
                  console.log(result);

                  var rejectStatement = `${rejectedRecords} records rejected due to invalid Cup Ids i.e non 10 digit ids.`;
                  var insertStatement = `${insertedRecords} return records added.`
                  var duplicateStatement = `${duplicateRecords.length} duplicate records found.`

                  outputObject.inserted = insertStatement;
                  outputObject.rejected = rejectStatement;
                  outputObject.duplicatesFound = duplicateStatement;
                  res.status(201).send(outputObject);
                });
              });
            });
          }
          else {
            var rejectStatement = `${rejectedRecords} records rejected due to invalid Cup Ids i.e non 10 digit ids.`;
            var insertStatement = `0 return records added.`
            var duplicateStatement = `${duplicateRecords.length} duplicate records found.`

            outputObject.inserted = insertStatement;
            outputObject.rejected = rejectStatement;
            outputObject.duplicatesFound = duplicateStatement;
            res.status(200).send(outputObject);
          }
        });
        /* End transaction */
      });
    }
  }
});

module.exports = router;
