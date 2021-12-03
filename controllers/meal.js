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
    mealsModel.find({})
    .exec()
    .then((data) => {
            data = data.map(value => value.toObject());
            var mealsByCat =[];
            for(let i = 0; i < data.length; i++){
                let recorded = false;
                for(let j = 0; j < mealsByCat.length && !recorded; j++){
                    if(data[i].category === mealsByCat[j].category){
                        mealsByCat[j].meal.push(data[i]);
                        recorded = true;
                    }
                }
                if(!recorded){
                    mealsByCat.push({
                        category: data[i].category,
                        meal: [
                            data[i]
                        ]}
                    );
                }
            }
        res.render("meal/onthemenu", {
            mealsByCat,
            title: "On the Menu"
        });
    });
});

module.exports = router;