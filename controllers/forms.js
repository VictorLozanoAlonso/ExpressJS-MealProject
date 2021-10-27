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
 router.post("/sign-up", (req, res) => {
    const { fName, lName, email, password } = req.body;
    const regexEmail = /^(([^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+(\.[^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]{3,})+\.)+[a-zA-Z]{2,})$/;
    let passed = true;
    let validation = {};
    if (fName === null || fName.length === 0){
        passed = false;
        validation.fName = "*First Name cannot be null or empty";
    }
    if (lName === null || lName.length === 0){
        passed = false;
        validation.lName = "*Last Name cannot be null or empty";
    }
    if (email.search(regexEmail) === -1){
        passed = false;
        validation.email = "*Format is incorrect. You should use something like email@email.com"
    }
    if (password.search(/\d/) === -1 || password.search(/\W/) === -1 || password.search(/[a-z]/) === -1 || password.search(/[A-Z]/) === -1 || password.length < 6 || password.length > 12){
        passed = false;
        validation.password = "*Password must have 6 to 12 characters and contains at least one lowercase letter, uppercase letter, number and symbol"
    }
    if(!passed){
        res.render("forms/signup", {
            title: "Sign Up",
            values: req.body,
            validation
        });
    }
});
 router.get("/login", function(req, res) {
     res.render("forms/login", {
         title: "Login"
     });
 });
 module.exports = router;