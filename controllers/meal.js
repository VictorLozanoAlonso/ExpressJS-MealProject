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
const router = express.Router();

router.get("/on-the-menu", function(req, res) {
    res.render("meal/onthemenu", {
        meals: mealsModel.getMealsByCat(),
        title: "On the Menu",
        clerk: req.session.loginType === "Clerk"
    });
});

module.exports = router;