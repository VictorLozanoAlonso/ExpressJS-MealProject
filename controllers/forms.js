/************************************************************************************
 *  WEB322 – Project (Fall 2021)
 *  I declare that this assignment is my own work in accordance with Seneca Academic
 *  Policy. No part of this assignment has been copied manually or electronically from
 *  any other source (including web sites) or distributed to other students.
 * Name: Victor Lozano Alonso
 * Student ID: 130720204
 * Course/Section: WEB322 ZAA
 ************************************************************************************/

 const express = require('express');
 const router = express.Router();
 
 //Routes 
 router.get("/sign-up", function(req, res) {
     res.render("forms/signup", {
         title: "Sign Up"
     });
 });
 router.get("/login", function(req, res) {
     res.render("forms/login", {
         title: "Login"
     });
 });
 module.exports = router;