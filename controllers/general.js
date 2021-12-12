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
const express = require('express');
const nameWelcome = require("./forms.js");
const router = express.Router();

//Routes
router.get("/", function(req, res) {
    mealsModel.find({
        topMeal: true
    })
    .exec()
    .then((topMeals) => {
        topMeals = topMeals.map(value => value.toObject());
            res.render("general/home", {
                topMeals,
                title: "Home"
            });
        });
});
router.get("/welcome", function(req, res) {
    mealsModel.find({
        topMeal: true
    })
    .exec()
    .then((topMeals) => {
        topMeals = topMeals.map(value => value.toObject());
            res.render("general/welcome", {
                topMeals,
                title: "Welcome Page"
            });
    });
});

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    res.redirect("/login");
});

router.get("/cart", (req, res) => {
    if(req.session && req.session.user){
        res.render("general/cart", {
            title: "Cart"
        });
    } else {
        res.redirect("/");
    }
});
module.exports = router;