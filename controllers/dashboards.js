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
const express = require ('express');
const router = express.Router ();

function clerkDb (req, res, next) {
  if (req.session.loginType === 'Clerk') {
    next ();
  } else {
    res.redirect ('/login');
  }
}
function customerDb (req, res, next) {
  if (req.session.loginType === 'Customer') {
    next ();
  } else {
    res.redirect ('/login');
  }
}
router.get ('/clerk', clerkDb, (req, res) => {
  res.render ('dashboards/clerk', {
    title: "Clerk Dashboard",
    clerk: req.session.loginType === "Clerk"  
  });
});
router.get ('/customer', customerDb, (req, res) => {
  res.render ('dashboards/customer', {
    title: "Customer Dashboard",
    topMeals: mealsModel.getTopMeals(),
    clerk: req.session.loginType === "Clerk"     
  });
});

module.exports = router;
