/************************************************************************************
 *  WEB322 – Project (Fall 2021)
 *  I declare that this assignment is my own work in accordance with Seneca Academic
 *  Policy. No part of this assignment has been copied manually or electronically from
 *  any other source (including web sites) or distributed to other students.
 * Name: Victor Lozano Alonso
 * Student ID: 130720204
 * Course/Section: WEB322 ZAA
 ************************************************************************************/
 const mealsModel = require("../models/mealList.js");
 const userModel = require("../models/user.js");
 const bcrypt = require("bcryptjs");
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
    if (email === null || email.length === 0){
        passed = false;
        validation.email = "*Email cannot be null or empty";
    }
    else if (email.search(regexEmail) === -1){
        passed = false;
        validation.email = "*Format is incorrect. You should use something like email@email.com"
    }
    if (password === null || password.length === 0){
        passed = false;
        validation.password = "*Password cannot be null or empty";
    }
    else if (password.search(/\d/) === -1 || password.search(/\W/) === -1 || password.search(/[a-z]/) === -1 || password.search(/[A-Z]/) === -1 || password.length < 6 || password.length > 12){
        passed = false;
        validation.password = "*Password must have 6 to 12 characters and contains at least one lowercase letter, uppercase letter, number and symbol"
    }
    if(passed){
        const user = new userModel({
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password: req.body.password
        });
        user.save()
        .then((userSaved) => {
            // User was saved correctly.
            console.log(`User ${userSaved.fName} ${userSaved.lName} has been added to the database.`);
            const sgMail = require("@sendgrid/mail");
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            
            const msg = {
                to: email,
                from: 'vlozano-alonso@myseneca.ca',
                subject: `Welcome ${fName}!`,
                html:
                `<h1>Hi ${fName}!</h1>
                <h2>Welcome to fastRecipe!</h2>
                <p>Your registered information is:<br>
                <ul>
                <li>Full name: <strong>${fName} ${lName}</strong></li>
                <li>Email: <strong>${email}</strong></li>
                </ul>
                Let me present. I am your chef Victor Lozano. I will be delighted to help you with your future meal kits.<br> 
                </p>`
            };
            
            sgMail.send(msg)
            .then(() => {
                res.redirect("welcome");
                var fullName = "";
                module.exports.fullName = function() {
                    return fullName = fName + " " + lName;
                };
            })
            .catch(err => {
                console.log(`Error ${err}`);
                
                res.render("forms/signup", {
                    title: "Sign Up",
                    values: req.body,
                    validation
                });
            });
        })
        .catch((err) => {
            console.log(`Error adding user to the database ... ${err}`);
            if (err.code === 11000){
                validation.email = "*email user is already exist."
            }
            res.render("forms/signup", {
                title: "Sign Up",
                values: req.body,
                validation
            });
        });
    }
    else{
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
 router.post("/login", function(req, res) {
    const { email, password } = req.body;
    const regexEmail = /^(([^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+(\.[^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]{3,})+\.)+[a-zA-Z]{2,})$/;
    let validation = {};
    let passed = true;
    if (email === null || email.length === 0){
        passed = false;
        validation.email = "*Email cannot be null or empty";
    }
    else if (email.search(regexEmail) === -1){
        passed = false;
        validation.email = "*Format is incorrect. You should use something like email@email.com"
    }
    if (password === null || password.length === 0){
        passed = false;
        validation.password = "*Password cannot be null or empty";
    }
    if(passed){
        userModel.findOne({
            email: req.body.email
        })
        .then(user => {
            // Completed the search.
            if (user) {
                // Found the user document.
                // Compare the password entered in the form with the one in the user document.
                bcrypt.compare(req.body.password, user.password)
                .then(isMatched => {
                    // Done comparing the passwords.
    
                    if (isMatched) {
                        // Passwords match.
                        // Create a new session and store the user document (object)
                        // to the session.
                        req.session.user = user;
                        req.session.loginType = req.body.loginType;
                        if(req.session.loginType === "Clerk"){
                            res.redirect("/clerk");
                        } 
                        else if(req.session.loginType === "Customer"){
                            res.redirect("/customer");
                        }
                        else{
                            res.redirect("/");
                        }

                    }
                    else {
                        // Passwords to not match.
                        console.log("Passwords do not match.");
                        validation.password = "*Invalid Password";
                        res.render("forms/login", {
                            title: "Login",
                            values: req.body,
                            validation
                        });

                    }
                })
                .catch(err => {
                    // Couldn't compare passwords.
                    console.log(`Unable to compare passwords ... ${err}`);        
                    res.render("forms/login", {
                        title: "Login",
                        values: req.body,
                        validation
                    });
                });
    
            }
            else {
                // User was not found in the database.
                console.log("Email not found in the database.");   
                validation.email = "*Email does not exist"
                res.render("forms/login", {
                    title: "Login",
                    values: req.body,
                    validation
                });
            }
        })
        .catch(err => {
            // Couldn't query the database.
            console.log(`Error finding the user in the database ... ${err}`);    
            res.render("forms/login", {
                title: "Login",
                values: req.body,
                validation
            });
        });
    } else{
        res.render("forms/login", {
            title: "Login",
            values: req.body,
            validation
        });
    }
 });

 router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    res.redirect("/login");
});

 module.exports = router;