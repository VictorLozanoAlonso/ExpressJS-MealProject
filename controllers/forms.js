/************************************************************************************
 *  WEB322 – Project (Fall 2021)
 *  I declare that this assignment is my own work in accordance with Seneca Academic
 *  Policy. No part of this assignment has been copied manually or electronically from
 *  any other source (including web sites) or distributed to other students.
 * Name: Victor Lozano Alonso
 * Student ID: 130720204
 * Course/Section: WEB322 ZAA
 ************************************************************************************/
const mealsModel = require ('../models/mealList.js');
const userModel = require ('../models/user.js');
const bcrypt = require ('bcryptjs');
const path = require ('path');
const express = require ('express');
const router = express.Router ();

//Routes
router.get ('/sign-up', function (req, res) {
  res.render ('forms/signup', {
    title: 'Sign Up',
  });
});
router.post ('/sign-up', (req, res) => {
  const {fName, lName, email, password} = req.body;
  const regexEmail = /^(([^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+(\.[^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]{3,})+\.)+[a-zA-Z]{2,})$/;
  let passed = true;
  let validation = {};
  if (fName === null || fName.length === 0) {
    passed = false;
    validation.fName = '*First Name cannot be null or empty';
  }
  if (lName === null || lName.length === 0) {
    passed = false;
    validation.lName = '*Last Name cannot be null or empty';
  }
  if (email === null || email.length === 0) {
    passed = false;
    validation.email = '*Email cannot be null or empty';
  } else if (email.search (regexEmail) === -1) {
    passed = false;
    validation.email =
      '*Format is incorrect. You should use something like email@email.com';
  }
  if (password === null || password.length === 0) {
    passed = false;
    validation.password = '*Password cannot be null or empty';
  } else if (
    password.search (/\d/) === -1 ||
    password.search (/\W/) === -1 ||
    password.search (/[a-z]/) === -1 ||
    password.search (/[A-Z]/) === -1 ||
    password.length < 6 ||
    password.length > 12
  ) {
    passed = false;
    validation.password =
      '*Password must have 6 to 12 characters and contains at least one lowercase letter, uppercase letter, number and symbol';
  }
  if (passed) {
    const user = new userModel ({
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      password: req.body.password,
    });
    user
      .save ()
      .then (userSaved => {
        // User was saved correctly.
        console.log (
          `User ${userSaved.fName} ${userSaved.lName} has been added to the database.`
        );
        const sgMail = require ('@sendgrid/mail');
        sgMail.setApiKey (process.env.SEND_GRID_API_KEY);

        const msg = {
          to: email,
          from: 'vlozano-alonso@myseneca.ca',
          subject: `Welcome ${fName}!`,
          html: `<h1>Hi ${fName}!</h1>
                <h2>Welcome to fastRecipe!</h2>
                <p>Your registered information is:<br>
                <ul>
                <li>Full name: <strong>${fName} ${lName}</strong></li>
                <li>Email: <strong>${email}</strong></li>
                </ul>
                Let me present. I am your chef Victor Lozano. I will be delighted to help you with your future meal kits.<br> 
                </p>`,
        };

        sgMail
          .send (msg)
          .then (() => {
            req.session.user = user;
            res.redirect ('welcome');
          })
          .catch (err => {
            console.log (`Error ${err}`);

            res.render ('forms/signup', {
              title: 'Sign Up',
              values: req.body,
              validation,
            });
          });
      })
      .catch (err => {
        console.log (`Error adding user to the database ... ${err}`);
        if (err.code === 11000) {
          validation.email = '*email user is already exist.';
        }
        res.render ('forms/signup', {
          title: 'Sign Up',
          values: req.body,
          validation,
        });
      });
  } else {
    res.render ('forms/signup', {
      title: 'Sign Up',
      values: req.body,
      validation,
    });
  }
});
router.get ('/login', function (req, res) {
  res.render ('forms/login', {
    title: 'Login',
  });
});
router.post ('/login', function (req, res) {
  const {email, password} = req.body;
  const regexEmail = /^(([^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+(\.[^<>\/()\º\ª$%'!?=·#*{}[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]{3,})+\.)+[a-zA-Z]{2,})$/;
  let validation = {};
  let passed = true;
  if (email === null || email.length === 0) {
    passed = false;
    validation.email = '*Email cannot be null or empty';
  } else if (email.search (regexEmail) === -1) {
    passed = false;
    validation.email =
      '*Format is incorrect. You should use something like email@email.com';
  }
  if (password === null || password.length === 0) {
    passed = false;
    validation.password = '*Password cannot be null or empty';
  }
  if (passed) {
    userModel
      .findOne ({
        email: req.body.email,
      })
      .then (user => {
        // Completed the search.
        if (user) {
          // Found the user document.
          // Compare the password entered in the form with the one in the user document.
          bcrypt
            .compare (req.body.password, user.password)
            .then (isMatched => {
              // Done comparing the passwords.

              if (isMatched) {
                // Passwords match.
                // Create a new session and store the user document (object)
                // to the session.
                req.session.user = user;
                req.session.loginType = req.body.loginType;
                req.session.isClerk = req.session.loginType === 'Clerk';
                if (req.session.loginType === 'Clerk') {
                  res.redirect ('/clerk');
                } else if (req.session.loginType === 'Customer') {
                  res.redirect ('/customer');
                } else {
                  res.redirect ('/');
                }
              } else {
                // Passwords to not match.
                console.log ('Passwords do not match.');
                validation.password = '*Invalid Password';
                res.render ('forms/login', {
                  title: 'Login',
                  values: req.body,
                  validation,
                });
              }
            })
            .catch (err => {
              // Couldn't compare passwords.
              console.log (`Unable to compare passwords ... ${err}`);
              res.render ('forms/login', {
                title: 'Login',
                values: req.body,
                validation,
              });
            });
        } else {
          // User was not found in the database.
          console.log ('Email not found in the database.');
          validation.email = '*Email does not exist';
          res.render ('forms/login', {
            title: 'Login',
            values: req.body,
            validation,
          });
        }
      })
      .catch (err => {
        // Couldn't query the database.
        console.log (`Error finding the user in the database ... ${err}`);
        res.render ('forms/login', {
          title: 'Login',
          values: req.body,
          validation,
        });
      });
  } else {
    res.render ('forms/login', {
      title: 'Login',
      values: req.body,
      validation,
    });
  }
});
function isClerk (req, res, next) {
  if (req.session.loginType === 'Clerk') {
    next ();
  } else {
    res.redirect ('/login');
  }
}
router.get ('/add-meal', isClerk, function (req, res) {
  res.render ('forms/add-meal', {
    title: 'Add Meal',
  });
});

router.post ('/add-meal', isClerk, function (req, res) {
  const meal = new mealsModel ({
    mealName: req.body.title,
    ingredients: req.body.ingredients,
    description: req.body.description,
    category: req.body.category,
    price: parseFloat (req.body.price).toFixed(2),
    cookTime: req.body.cookTime,
    servings: req.body.servings,
    calories: req.body.calories,
    topMeal: req.body.topMeal === 'true',
  });
  if (req.files) {
    let extension = path.parse (req.files.mealImage.name).ext;
    if (
      extension === '.jpeg' ||
      extension === '.jpg' ||
      extension === '.png' ||
      extension === '.bmp' ||
      extension === '.gif'
    ) {
      meal.imgUrl = extension;
      meal
        .save ()
        .then (mealSaved => {
          // Meal was saved correctly.
          console.log (`${mealSaved.mealName} has been added to the database.`);
          // Create a unique name for the image, so it can be stored in the file system.
          let uniqueName = `${mealSaved.mealName}-${mealSaved._id}${extension}`;
          // Copy the image data to a file in the "public/profile-pictures" folder.
          req.files.mealImage.mv (`public/images/${uniqueName}`)
          .then (() => {
            // Update the user document so that the name of the image is stored in the document.
            mealsModel
              .updateOne (
                {
                  _id: mealSaved._id,
                },
                {
                  imgUrl: '/images/' + uniqueName,
                }
              )
              .then (() => {
                console.log ('Meal Kit was fully loaded into the database.');
                res.render ('forms/add-meal', {
                  title: 'Meal added',
                  message: 'Meal Kit was fully loaded into the database',
                });
              })
              .catch (err => {
                console.log (`Error saving the meal image ... ${err}`);
                res.render ('forms/add-meal', {
                  title: 'Error adding meal',
                  message: 'Error saving image. Try again...',
                  values: req.body
                });
              });
          });
        })
        .catch (err => {
          console.log (`Error adding meal kit to the database ... ${err}`);
          res.render ('forms/add-meal', {
            title: 'Error adding meal',
            message: 'Error adding meal. Try again...',
            values: req.body
          });
        });
    } else {
      console.log (`Wrong File extension. Try again ...`);
      res.render ('forms/add-meal', {
        title: 'Error adding meal',
        message: 'Incorrect Image extension. Try again...',
        values: req.body
      });
    }
  } else {
    console.log (`Error adding meal kit to the database ...`);
    res.render ('forms/add-meal', {
      title: 'Error adding meal',
      message: 'Error saving data. Try again...',
      values: req.body
    });
  }
});

router.get ('/list-meals', isClerk, function (req, res) {
  mealsModel.find ({}).exec ().then (data => {
    data = data.map (value => value.toObject ());
    res.render ('forms/list-meals', {
      title: 'List of the meals',
      data
    });
  });
});

router.get ('/update-meals', isClerk, function (req, res) {
    mealsModel.find ({}).exec ().then (data => {
      data = data.map (value => value.toObject ());
      res.render ('forms/update-meals', {
        title: 'Update meals',
        data
      });
    });
  });

  router.post ('/update-meals', isClerk, function (req, res) {
    mealsModel.find ({
        _id: req.body.id
        }).exec ().then (data => {
            data = data.map (value => value.toObject ());
            res.render ('forms/update-item', {
                title: 'Update item',
                data
            });
        });
    });

    router.get ('/update-item', isClerk, function (req, res) {
      res.render ('forms/update-item', {
        title: 'Update item'
      });
    });
router.post ('/update-item', isClerk, function (req, res) {
  let urlImageToUpdate;
  if (req.files) {
    let extension = path.parse (req.files.mealImage.name).ext;
    if (
      extension === '.jpeg' ||
      extension === '.jpg' ||
      extension === '.png' ||
      extension === '.bmp' ||
      extension === '.gif'
    ) {
      // Create a unique name for the image, so it can be stored in the file system.
      let uniqueName = `${req.body.title}-${req.body.id}${extension}`;
      // Copy the image data to a file in the "public/profile-pictures" folder.
      req.files.mealImage.mv (`public/images/${uniqueName}`)
      .then (() => {
        urlImageToUpdate = '/images/' + uniqueName;
        mealsModel.updateOne({
          _id: req.body.id
      }, {
          $set: {
              mealName: req.body.title,
              description: req.body.description,
              ingredients: req.body.ingredients,
              category: req.body.category,
              price: req.body.price,
              cookTime: req.body.cookTime,
              servings: req.body.servings,
              calories: req.body.calories,
              imgUrl: urlImageToUpdate,
              topMeal: req.body.topMeal === 'true'
          }
      })
      .exec()
      .then(() => {
          mealsModel.find ({
              _id: req.body.id
              }).exec ().then (data => {
                  data = data.map (value => value.toObject ());
                  res.render ('forms/update-item', {
                      title: 'Item Updated',
                      data,
                      checked: req.body.topMeal,
                      message: "Meal " + req.body.title + " was updated"
                  });
              });
          });
      })
    } else {
      console.log (`Wrong File extension. Try again ...`);
      mealsModel.find ({
        _id: req.body.id
      }).exec ().then (data => {
        data = data.map (value => value.toObject ());
        res.render ('forms/update-item', {
          title: 'Error updating meal',
          message: 'Incorrect Image extension. Try again...',
          data
        });
      });
    }
  } else {
    mealsModel.find ({
      _id: req.body.id
    }).exec ().then (data => {
      data = data.map (value => value.toObject ());
      urlImageToUpdate = data[0].imgUrl;
      mealsModel.updateOne({
        _id: req.body.id
    }, {
        $set: {
            mealName: req.body.title,
            description: req.body.description,
            ingredients: req.body.ingredients,
            category: req.body.category,
            price: req.body.price,
            cookTime: req.body.cookTime,
            servings: req.body.servings,
            calories: req.body.calories,
            imgUrl: urlImageToUpdate,
            topMeal: req.body.topMeal === 'true'
        }
    })
    .exec()
    .then(() => {
        mealsModel.find ({
            _id: req.body.id
            }).exec ().then (data => {
                data = data.map (value => value.toObject ());
                res.render ('forms/update-item', {
                    title: 'Item Updated',
                    data,
                    checked: req.body.topMeal,
                    message: "Meal " + req.body.title + " was updated"
                });
            });
        });
    });
  }
});
module.exports = router;
