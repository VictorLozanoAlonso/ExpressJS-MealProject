/************************************************************************************
 *  WEB322 – Project (Fall 2021)
 *  I declare that this assignment is my own work in accordance with Seneca Academic
 *  Policy. No part of this assignment has been copied manually or electronically from
 *  any other source (including web sites) or distributed to other students.
 * Name: Victor Lozano Alonso
 * Student ID: 130720204
 * Course/Section: WEB322 ZAA
 ************************************************************************************/
const express = require ('express');
const exphbs = require ('express-handlebars');
const session = require ('express-session');
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require ("mongoose");

//Set up dotenv environment variables
dotenv.config({path:"./config/keys.env"});

// Set up Express
const app = express ();

// Set up Handlebars
app.engine (
  '.hbs',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
  })
);

app.set ('view engine', '.hbs');

// Set up express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  // res.locals.user is a global handlebars variable.
  // This means that every single handlebars file can access this variable.
  res.locals.user = req.session.user;
  res.locals.clerk = req.session.isClerk;
  res.locals.cart = req.session.cart;
  res.locals.customer = req.session.loginType === 'Customer';
  next();
});

// Set up static folder
app.use (express.static (__dirname + '/public'));

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up express-fileupload
app.use(fileUpload());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to the MongoDB database.");
})
.catch((err) => {
  console.log(`There was a problem connecting to MongoDB ... ${err}`);
});

// Load controllers into Express
const generalController = require("./controllers/general");
const mealController = require("./controllers/meal");
const formController = require("./controllers/forms");
const dashboardsController = require("./controllers/dashboards");
const loaddataController = require("./controllers/load-data");

app.use("/", generalController);
app.use("/", mealController);
app.use("/", formController);
app.use("/", dashboardsController);
app.use("/load-data", loaddataController);

// *** THE FOLLOWING CODE SHOULD APPEAR IN YOUR ASSIGNMENT AS IS (WITHOUT MODIFICATION) ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use ((req, res) => {
  res.status (404).send ('Page Not Found');
});

// This use() will add an error handler function to
// catch all errors.
app.use (function (err, req, res, next) {
  console.error (err.stack);
  res.status (500).send ('Something broke!');
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart () {
  console.log ('Express http server listening on: ' + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen (HTTP_PORT, onHttpStart);
