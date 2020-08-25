var express = require('express');
var router = express.Router();

// Load the MySQL pool connection
const pool = require('../db-config');

router.get('/numberofcupsbytimesused', function (req, res, next) {

    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query(
            'SELECT tu.times_used, COUNT(*) as `number_of_cups` \
            FROM (SELECT cup_id, COUNT(*) as \'times_used\' \
            FROM `RETURN` \
            WHERE date(convert_tz(scanned_at, \'+00:00\', \'+11:00\')) >= \'2020-01-22\' \
            GROUP BY cup_id) tu \
            GROUP BY tu.times_used \
            ORDER BY tu.times_used DESC', 
            function (error, results, fields) {
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

module.exports = router;