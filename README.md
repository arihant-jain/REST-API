# REST-API
A REST-API built entirely in JavaScript using Express.js framework. It talks to a MySQL database to save/fetch the data in JSON format.

**This API is built for Borrow Cup. Borrow Cup is a students’ initiative towards sustainable living funded by Monash University. According 
to some statistics, about 1 million disposable cups are used across Monash University Melbourne campuses every year. This initiative aims 
to reduce that number by allowing students and staff to use Borrow Cup.**

More information about **Borrow Cup** can be found at [Borrow Cup website](https://www.borrowcup.com).


## The Project
This API is part of a larger IT project which aims to track the *Borrow Cups* usage on university campus and generate insights from the 
data collected.

## Progress
The API is constantly being enhanced to include essential features/methods when such requirements arise while also trying to follow 
industry's best code practices. It has been built to quickly get started with data collection and extraction to support other applications 
using it and is not highly secure or robust. However, as the project becomes mature, things like security and robustness will also be 
included.

## How to run?
The API establishes a connection with a MySQL database that has a particular schema. To properly run it on your local machine, you would 
have to install MySQL locally, create a database schema and run the database on a local server. I would recommend creating your own small 
database (with one or two tables), running it locally and then making changes to an API endpoint (example: api/cup.js) in this project to 
talk to your database tables. Please check all methods (GET, PUT or POST) in your modified .js endpoint file for compatibility with your 
tables' structures and modify accordingly.

1. Create your own MySQL local database and run it on a local server.
2. Clone the repository in your local machine.
3. Download <a href="https://code.visualstudio.com/">Visual Studio Code</a>.
4. Download <a href="https://nodejs.org/en/">Node.js</a> runtime and install it with default settings.
5. Open the repository (downloaded folder) in Visual Studio code.
6. Press Ctrl + ` (Control + backtick) to open Terminal (if not already open).
7. Type `npm install` and hit ENTER to install the dependencies.
8. Open the .env file and replace user, password, host, port and database name with your database credentials.
9. Modify any endpoint(s) in the *api* folder (example: cup.js). You would have to make the API methods you want to test compatible 
with your database tables. For a quick test, comment all methods except the first GET method and change the value of the `table` 
variable at the top of the file to your table name.
10. Type `npm start` and hit ENTER to start the API.
11. Go to http://localhost:3000 in your browser to see it running.
12. Hit your modified endpoint methods (example: http://localhost:3000/api/cup) to see it talk to your own database tables.
