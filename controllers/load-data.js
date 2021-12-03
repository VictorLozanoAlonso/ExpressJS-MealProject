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

router.get("/meal-kits", (req, res) => {
    if (req.session && req.session.user && req.session.loginType === "Clerk") {
        mealsModel.find().count({}, (err, count) => {
            if (err) {
                console.log("Couldn't find: " + err);
                res.redirect("/");
            }
            else if (count === 0) {
                var mealsToAdd = mealsModel.fakeMeals();
                mealsModel.collection.insertMany(mealsToAdd,  (err, docs) => {
                    if (err) {
                        console.log("Couldn't insert: " + err);
                        res.redirect("/");
                    }
                    else {
                        res.render ('load-data/meal-kits', {
                            title: "Data loaded",
                            message: "Added meal kits to the database"     
                        });
                    }
                });
            }
            else {
                res.render ('load-data/meal-kits', {
                    title: "Data loaded",
                    message: "Meal kits have already been added to the database" 
                });
            }
        });
    }else{
        res.render ('load-data/meal-kits', {
            title: "Restricted Access",
            message: "You are not authorized to add meal kits"
        });
    }
});

module.exports = router;