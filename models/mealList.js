/************************************************************************************
 *  WEB322 – Project (Fall 2021)
 *  I declare that this assignment is my own work in accordance with Seneca Academic
 *  Policy. No part of this assignment has been copied manually or electronically from
 *  any other source (including web sites) or distributed to other students.
 * Name: Victor Lozano Alonso
 * Student ID: 130720204
 * Course/Section: WEB322 ZAA
 ************************************************************************************/
 
let mealsList = [
    {
        mealName: "California Steak",
        ingredients: "with Veggies and Roasted Potato",
        description: "Awesome beef steak roasted in pine charcoal accompanied with potatoes and other cooked veggies",
        category: "Barbecue Meals",
        price: "$25.99",
        cookTime: "20min",
        servings: "1",
        calories: "380",
        imgUrl: "/images/california-steak.jpg",
        topMeal: true
    },
    {
        mealName: "Pork Ribs",
        ingredients: "with Chilli and Barbecue Sauce",
        description: "Tender Pork Ribs slowly cooked to get the ember flavors. It brings whole chilli and Barbecue Sauce",
        category: "Barbecue Meals",
        price: "$38.90",
        cookTime: "30min",
        servings: "2",
        calories: "450",
        imgUrl: "/images/pork-ribs.jpg",
        topMeal: false
    },
    {
        mealName: "Roasted Bass",
        ingredients: "accompanied Pepper and Secret Sauce",
        description: "Bass with a delicious pepper and other steamed veggies. Try and discover the secret sauce. Plate perfect for warm days.",
        category: "Barbecue Meals",
        price: "$26.95",
        cookTime: "15min",
        servings: "1",
        calories: "280",
        imgUrl: "/images/roasted-bass.jpg",
        topMeal: false
    },
    {
        mealName: "Shushi Shashimi",
        ingredients: "with Black Sauce",
        description: "The sushi roll is wearing raw Salmon on the outside of a maki roll made with half a avocado and prawn",
        category: "International Food",
        price: "$39.95",
        cookTime: "20min",
        servings: "2",
        calories: "310",
        imgUrl: "/images/shushi-shashimi.jpg",
        topMeal: true
    },
    {
        mealName: "Paella Valenciana",
        ingredients: "Rice Base & Seafood",
        description: "Version of the most popular Spanish dish. Order with amazing 'Alioli' sauce.",
        category: "International Food",
        price: "$32.95",
        cookTime: "40min",
        servings: "4",
        calories: "480",
        imgUrl: "/images/paella.jpg",
        topMeal: true
    },
    {
        mealName: "Lasagne Italiane",
        ingredients: "bolognese with grilled cheese",
        description: "Spectacular pasta noodle filled in several layers with bolognese sauce. At the top, you feel the creamy grilled cheese. ",
        category: "International Food",
        price: "$29.95",
        cookTime: "30min",
        servings: "1",
        calories: "650",
        imgUrl: "/images/lasagne.jpg",
        topMeal: false
    },
    {
        mealName: "Onion Chicken",
        ingredients: "marinade accompanied with tomato",
        description: "Marinade chicken for three days. Just to cook brush with honey sauce included in the kit.",
        category: "Barbecue Meals",
        price: "$23.45",
        cookTime: "25min",
        servings: "2",
        calories: "345",
        imgUrl: "/images/chicken-onion.jpg",
        topMeal: false
    },
    {
        mealName: "Canadian Poutine",
        ingredients: "bacon & cheese sauce",
        description: "Extremely easy recipe with delicious flavor. Potatoes 100% from Canada",
        category: "International Food",
        price: "$22.45",
        cookTime: "15min",
        servings: "2",
        calories: "490",
        imgUrl: "/images/poutine.jpg",
        topMeal: false
    }
];

module.exports.getMealsByCat = function () {
    var mealsByCat = [{
        category: mealsList[0].category,
        meal: [
            mealsList[0]
        ]
    }];
    for(let i = 1; i < mealsList.length; i++){
         let recorded = false;
         for(let j = 0; j < mealsByCat.length && !recorded; j++){
             if(mealsList[i].category === mealsByCat[j].category){
                mealsByCat[j].meal.push(mealsList[i]);
                recorded = true;
             }
         }
         if(!recorded){
            mealsByCat.push({
                category: mealsList[i].category,
                meal: [
                    mealsList[i]
                ]}
            );
         }
    }
    return mealsByCat;
}

module.exports.getTopMeals = function () {
  var filtered = [];
  for (var i = 0; i < mealsList.length; i++) {
    if (mealsList[i].topMeal) {
      filtered.push (mealsList[i]);
    }
  }
  return filtered;
};
