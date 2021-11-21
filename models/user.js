/************************************************************************************
 *  WEB322 – Project (Fall 2021)
 *  I declare that this assignment is my own work in accordance with Seneca Academic
 *  Policy. No part of this assignment has been copied manually or electronically from
 *  any other source (including web sites) or distributed to other students.
 * Name: Victor Lozano Alonso
 * Student ID: 130720204
 * Course/Section: WEB322 ZAA
 ************************************************************************************/

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save", function(next) {
    let user = this;

    // Generate a unique salt.
    bcrypt.genSalt(10)
    .then(salt => {
        // Hash the password using the salt.
        bcrypt.hash(user.password, salt)
        .then(hashedPwd => {
            // Password was hashed.
            // Update the user model and save to the database.
            user.password = hashedPwd;
            next();
        })
        .catch(err => {
            console.log(`Error occurred when hashing ... ${err}`);    
        })
    })
    .catch(err => {
        console.log(`Error occurred when salting ... ${err}`);
    })
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;