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
    if(req.session && req.session.loginType === 'Customer'){
        res.render("general/cart", {
            title: "Cart"
        });
    } else {
        res.redirect("/");
    }
});

router.get("/checkout", (req, res) => {
    if(req.session.loginType === 'Customer'){
        var cart = req.session.cart;
        if(cart.items > 0){
            const sgMail = require ('@sendgrid/mail');
            sgMail.setApiKey (process.env.SEND_GRID_API_KEY);
            var items = [];
            cart.cartItems.forEach(cartMeal => {
                items.push('<tr><td style="padding-right: 10px;">' + cartMeal.name + '</td><td style="padding-right: 5px;text-align: center;">' + cartMeal.qty + '</td><td style="padding-right: 5px;text-align: center;">$' + cartMeal.price + '</td><td style="padding-right: 5px;text-align: center;">$' + cartMeal.subtotal + '</td></tr>');
            });
            const msg = {
            to: req.session.user.email,
            from: 'vlozano-alonso@myseneca.ca',
            subject: `Order Placed ${req.session.user.fName}!`,
            html: `<h1>Hi ${req.session.user.fName}!</h1>
                    <h2>Your order was placed</h2>
                    <p>Mealkits summary:</p><br>
                    <table>
                        <thead>
                            <tr>
                                <th style="padding-right: 10px;">Mealkit</th>
                                <th style="padding-right: 5px;text-align:center;">Items</th>
                                <th style="padding-right: 5px;text-align: center;">Item Price</th>
                                <th style="padding-right: 5px;text-align: center;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.join('')}
                            <tr>
                                <td colspan="4"></td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Total</strong></td>
                                <td><strong>$${cart.total}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <p>Thanks for your purchase. You will receive them soon. Enjoy!<br> 
                    </p>`,
            };

            sgMail
            .send (msg)
            .then (() => {
                req.session.cart = {items:0, total:0.0, cartItems:[]};
                res.redirect ('/thanks');
            })
            .catch (err => {
                console.log (`Error ${err}`);
                res.redirect ('/cart');
            });
        } else {
            res.render("general/cart", {
                title: "Cart",
                message: "The cart is empty. Add some mealkit"
            });
        }
    } else{
        res.redirect ('/');
    }
});

router.get("/thanks", (req, res) => {
    if(req.session.loginType === 'Customer'){
        res.render("general/thanks", {
            title: "Thanks",
            message: "Thanks for your purchased. We are preparing everything for you. Check out your email for more details."
        });
    } else {
        res.redirect ('/');
    }
});

module.exports = router;