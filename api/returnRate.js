var express = require('express');
var router = express.Router();
// var moment = require('moment');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const pool = require('../db-config');

// Create a request variable and assign a new XMLHttpRequest object to it.
// var request = new XMLHttpRequest();

// function getRecordsCount(table, startDate, endDate){
    
//     startDate = startDate ? (String(startDate) + ' 00:00:00') : null;
//     endDate = endDate ? (String(endDate) + ' 00:00:00') : null;
//     if(startDate == null){
//         if(endDate == null){
//         sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table;
//         }
//         else{
//         sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE scanned_at <= \'' + endDate + '\'';
//         }
//     }
//     else{
//         if(endDate == null){
//         sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE scanned_at >= \'' + startDate  + '\'';
//         }
//         else{
//         sqlCommand = 'SELECT COUNT(*) AS COUNT FROM ' + table + ' WHERE scanned_at BETWEEN \'' + startDate + '\' AND \'' + endDate  + '\'';
//         }
//     }
//     console.log(sqlCommand)

//     var count;
//     pool.getConnection(function(err, connection) {
//         if (err) throw err; // not connected!
    
//         // Use the connection
//         connection.query(sqlCommand, function (error, results, fields) {
//         // When done with the connection, release it.
//         connection.release();
    
//         // Handle error after the release.
//         if (error) throw error;

//         // Don't use the connection here, it has been returned to the pool.
//         // console.log('results: ',results[0].COUNT);
//         count = {'COUNT': results[0].COUNT};
//         });
//     }); 
//     return count;
// }

// function getDateOfWeek(weekNumber,year){
//     //Create a date object starting january first of chosen year, plus the number of days in a week multiplied by the week number to get the right date.
//     var start = new Date(Date.UTC(year, 0, ((weekNumber-1)*7)+1));
//     start.setDate(start.getDate() - start.getDay());
//     var end = new Date(start.getTime() + 60 * 60 *24 * 7 * 1000 - 1)
//     return [start,end]
// }


/* GET returns listing. */
// router.get('/obsolete', function(req, res, next) {

//     var today = new Date();
//     console.log(today);
//     var datePairs = [];

//     var firstWeekNumber  = moment("2019/03/21", "YYYY/MM/DD").week();
//     var todayWeekNumber = moment(today.getUTCFullYear() + "/" + (today.getUTCMonth() + 1) + "/" + today.getUTCDate(), "YYYY/MM/DD").week();

//     console.log(firstWeekNumber)
//     console.log(todayWeekNumber)

//     // 'start year' represents the year when BorrowCup started.
//     startYear = moment("2019/03/21", "YYYY/MM/DD").year();

//     // 'current year' represents the current year. Pretty Obvious!
//     currentYear = moment(today.getUTCFullYear() + "/" + (today.getUTCMonth() + 1) + "/" + today.getUTCDate(), "YYYY/MM/DD").year();

//     console.log(startYear);
//     console.log(currentYear);

//     // Find week pairs when the year is same
//     if(startYear == currentYear){
//         for(var i = firstWeekNumber; i <= todayWeekNumber; i++){
//             [start,end] = getDateOfWeek(i, 2019)
//             datePairs.push([start,end])
//         }
//         //console.log(datePairs)
//     }

//     // Find week pairs when the year is not same
//     // LOGIC:
//     // Iterate over all years from 'start year' to 'current year' and find week pairs for each year.
//     else if(currentYear > startYear){
//         for(var year = startYear; year <= currentYear; year++){

//             // Find the first week number of the year the loop is at...
//             var startWeekNumber;
//             if(year != startYear){
//                 startWeekNumber = 1;
//             }
//             else{
//                 startWeekNumber = firstWeekNumber;
//             }
            
//             // Find the last week number of the year the loop is at...
//             // LOGIC: 
//             // Find the week number of the last date (31st Dec) of the year -
//             //      If found 1, then:
//             //          Find the week number for the 25th Dec of that year.
//             //          This date will be in the last week of that year and it will be 52th always.
//             //
//             //      If found 53, then this is the last week of that year.
//             //
//             //      If found something else: Impossible! This can never occur.

//             var lastWeekNumber;
//             if(year != currentYear){
//                 var weekNumber = moment(year+"/12/31", "YYYY/MM/DD").week();
//                 if(weekNumber == 1){
//                     weekNumber = moment(year+"/12/25", "YYYY/MM/DD").week();
//                 }
//                 else if(weekNumber == 53){
//                     console.log("Week number is 53 in year " + year);
//                 }
//                 else{
//                     console.log("Week number neither 1 nor 53")
//                 }
//                 lastWeekNumber = weekNumber;
//             }
//             else{
//                 lastWeekNumber = todayWeekNumber;
//             }
            
//             // Find all weeks in the year the loop is at...
//             for(var i = startWeekNumber; i <= lastWeekNumber; i++){
//                 [start,end] = getDateOfWeek(i, year)
//                 datePairs.push([start,end])
//             }
//         }
//         //console.log(datePairs)
//     }
//     allData = [];
//     datePairs.forEach(datePair => {
//         var startDate = datePair[0].toISOString().slice(0,10).replace(/-/g,'/');
//         var endDate = datePair[1].toISOString().slice(0,10).replace(/-/g,'/');
//         console.log(startDate,'to', endDate);

//         weekNumber = moment(startDate, "YYYY/MM/DD").week();

//         borrowData = getRecordsCount('SALE',startDate,endDate);
//         console.log('borrowed: ', borrowData);
//         borrowed = borrowData[0].COUNT;
        
//         returnData = getRecordsCount('`RETURN`',startDate,endDate);
//         console.log(returnData);
//         returned = returnData[0].COUNT;

//         returnRate = returned/borrowed*100;
//         console.log('Returned: ', returned);
//         console.log('Borrowed: ',borrowed);
//         console.log('Return Rate: ', returnRate.toFixed(2), '%');
//         console.log('\n')

//         if(!isFinite(returnRate)){
//             returnRate = 1;
//         }

//         weekData = {
//                         'weekNumber': weekNumber,
//                         'startDate' : startDate,
//                         'endDate' : endDate,
//                         'borrowed' : borrowed,
//                         'returned' : returned,
//                         'returnRate' : returnRate.toFixed(2)
//                     }
//         allData.push(weekData)
//     });

//     console.log(allData);
//     res.send(allData);
// });

// Return rate
router.get('/', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('SELECT sale_alias.YEAR, sale_alias.WEEK, sale_alias.SALE_TOTAL, return_alias.RETURN_TOTAL, (return_alias.RETURN_TOTAL/sale_alias.SALE_TOTAL*100) AS RATE \
                        FROM (SELECT year(s.scanned_at) AS YEAR, week(s.scanned_at, 2) AS WEEK, COUNT(s.id) AS SALE_TOTAL FROM SALE s GROUP BY YEAR, WEEK) as sale_alias \
                        LEFT JOIN \
                        (SELECT year(r.scanned_at) AS YEAR, week(r.scanned_at, 2) AS WEEK, COUNT(r.id) AS RETURN_TOTAL FROM `RETURN` r GROUP BY YEAR, WEEK) as return_alias \
                        ON sale_alias.YEAR = return_alias.YEAR AND sale_alias.WEEK = return_alias.WEEK \
                        UNION \
                        SELECT return_alias.YEAR, return_alias.WEEK, sale_alias.SALE_TOTAL, return_alias.RETURN_TOTAL, (return_alias.RETURN_TOTAL/sale_alias.SALE_TOTAL*100) AS RATE \
                        FROM (SELECT year(s.scanned_at) AS YEAR, week(s.scanned_at, 2) AS WEEK, COUNT(s.id) AS SALE_TOTAL FROM SALE s GROUP BY YEAR, WEEK) as sale_alias \
                        RIGHT JOIN \
                        (SELECT year(r.scanned_at) AS YEAR, week(r.scanned_at, 2) AS WEEK, COUNT(r.id) AS RETURN_TOTAL FROM `RETURN` r GROUP BY YEAR, WEEK) as return_alias \
                        ON sale_alias.YEAR = return_alias.YEAR AND sale_alias.WEEK = return_alias.WEEK ORDER BY YEAR, WEEK', function (error, results, fields) {
        
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