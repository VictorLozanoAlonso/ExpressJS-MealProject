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

router.get ('/mealkits/:id', function (req, res) {
    const mealId = req.params.id;
    mealsModel.findOne({_id: mealId}).lean()
    .exec()
    .then((data) => {
        res.render ('meal/meal-detail', {
            title: data.mealName,
            data
        });
    });
});

router.get ('/mealkits/:id/add', function (req, res) {
    const mealId = req.params.id;
    if (req.session.loginType === 'Customer') {
        var cart = req.session.cart = req.session.cart || {items:0, total:0.0, cartItems:[]};
        var found = false;
        cart.cartItems.forEach(cartMeal => {
            if (cartMeal.id === mealId) {
                found = true;
                cartMeal.qty++;
                cartMeal.subtotal = cartMeal.qty * cartMeal.price;
                cart.items++;
                cart.total = 0.0;
                cart.cartItems.forEach(cartMeal => {
                    cart.total += (cartMeal.qty * cartMeal.price);
                });
                cart.total = (cart.total).toFixed(2);
                res.redirect('/mealkits/' + mealId);
            }
        });
        if(!found){
            mealsModel.findOne({_id: mealId}).lean()
            .exec()
            .then((meal) => {
                cart.cartItems.push({
                    qty: 1,
                    id: meal._id,
                    name: meal.mealName,
                    subtotal: meal.price.toFixed(2),
                    price: meal.price.toFixed(2)
                });
                cart.items++;
                cart.total = 0.0;
                cart.cartItems.forEach(cartMeal => {
                    cart.total += (cartMeal.qty * cartMeal.price);
                });
                cart.total = (cart.total).toFixed(2);
                res.redirect('/mealkits/' + mealId);
            });
        }
    } else {
        res.redirect('/mealkits/' + mealId);
    }
});

router.get ('/mealkits/:id/remove', function (req, res) {
    const mealId = req.params.id;
    if(req.session.loginType === 'Customer'){
        var cart = req.session.cart || {items:0, total:0.0, cartItems:[]};
        const index = cart.cartItems.findIndex(cartMeal => { return cartMeal.id == mealId });
        message = `Removed "${cart.cartItems[index].name}" from the cart`;
        cart.items -= cart.cartItems[index].qty;
        cart.cartItems.splice(index, 1);
        cart.total = 0.0;
        cart.cartItems.forEach(cartMeal => {
            cart.total += (cartMeal.qty * cartMeal.price);
        });
        cart.total = cart.total.toFixed(2);
        res.render("general/cart", {
            title: "Cart",
            message
        });
    } else{
        res.redirect('/mealkits/' + mealId);
    }
});

module.exports = router;