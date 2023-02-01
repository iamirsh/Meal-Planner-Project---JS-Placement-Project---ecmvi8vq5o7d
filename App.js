'use strict';
//Spoonacular API Key;
const apiKey = '19bd80db854f48308fcfc70ec7e866c6';
//const mealUrl = `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=${calories}&apiKey=${apiKey}`;
//const recipeUrl = `https://api.spoonacular.com/recipes/716429/information?apiKey=${apiKey}&includeNutrition=false&id=${id}`;

//Element Selectors
const heightElmnt = document.querySelector('.height');
const weightElmnt = document.querySelector('.weight');
const ageElmnt = document.querySelector('.age');
const genderElmnt = document.querySelector('.gender');
const activityElmnt = document.querySelector('.activity');
const dummyCardElmnt = document.querySelector('.dummy-card');
const cardSectionElmnt = document.querySelector('.card-section');
const cardElmnt = document.querySelector('.meal-card');
const ingredientsElmnt = document.querySelector('.ingredients');
const equipmentsElmnt = document.querySelector('.equipments');
const stepsElmnt = document.querySelector('.steps');
const backgroundElmnt = document.querySelector('.background');
const recipeElmnt = document.querySelector('.recipe-section');
const generateBtn = document.querySelector('.generate-meal-btn');
const recipeBtn = document.querySelector('.get-recipe-btn');


//Fetching the data from the Spoonacular;
const apiMealData = async (calories) => {
    const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${calories}`);
    const result = await response.json();
    await apiRecipeData(result.meals);
};

// console.log("Meals: ",meals);
//API function to fetch the Recipe Data.
const apiRecipeData = async (meals) => {
    cardElmnt.innerHTML = " ";
    ingredientsElmnt.innerHTML = " ";
    equipmentsElmnt.innerHTML = " ";
    stepsElmnt.innerHTML = " ";

    meals.map(async (meal) => {
        const response = await fetch(`https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=${apiKey}&includeNutrition=false`);
        const recipeRes = await response.json();
        setTimeout(() => {
            createMealCardsFn(recipeRes);
        }, 725);
    });
};

//Function to Generate the Required Meal Plan;
const generateFn = () => {
    let height = heightElmnt.value;
    let weight = weightElmnt.value;
    let age = ageElmnt.value;
    let gender = genderElmnt.value;
    let activity = activityElmnt.value;

    if (height === '' || weight === '' || age === '') {
        return alert('Please provide valid inputs!');
    }

    let bmiValue = bmi(height, weight, age, gender);
    let calories = calCalories(bmiValue, activity).toFixed(2);
    // console.log('calories = ', calories);
    apiMealData(calories);
};

const bmi = (height, weight, age, gender) => {
    if (gender === 'female') {
        return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    } else {
        return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
    }
};

const calCalories = (bmiValue, activity) => {
    if (activity === 'light') {
        return bmiValue * 1.375;
    } else if (activity === 'moderate') {
        return bmiValue * 1.55;
    } else if (activity === 'active') {
        return bmiValue * 1.725;
    }
};

generateBtn.addEventListener('click', generateFn);

const equipmentArray = [];

const createMealCardsFn = (data) => {
    dummyCardElmnt.style.display = "none";
    backgroundElmnt.style.display = "block";
    recipeElmnt.style.display = "block";
    const item = document.createElement("span");
    const img = document.createElement("img");
    const title = document.createElement("h3");
    const getRecipeBtn = document.createElement("button");
    item.setAttribute("class", "grid");

    const getRecipeFn = () => {
        backgroundElmnt.style.display = "block";
        recipeElmnt.style.display = "block";
        ingredientsElmnt.innerHTML = " ";
        ingredientsElmnt.innerHTML = `<h2>Ingredients</h2>`;

        let apiIngredients = data.extendedIngredients;

        for (let i = 0; i < apiIngredients.length; i++) {
            let para = document.createElement("li");
            let newPara = apiIngredients[i].original;
            para.innerHTML = newPara;
            ingredientsElmnt.appendChild(para);
        }

        equipmentsElmnt.innerHTML = " ";
        equipmentsElmnt.innerHTML = `<h2>Equipments</h2>`;

        let instructions = data.analyzedInstructions;

        console.log("Instrucions: ", instructions);

        let recipeSteps = [];

        for (let j = 0; j < instructions.length; j++) {
            recipeSteps = instructions[j].steps;
        }
        console.log("recipeSteps: ", recipeSteps);

        let recipeEquipments = [];

        for (let i = 0; i < recipeSteps.length; i++) {
            recipeEquipments = recipeSteps[i].equipment;
        }
        // console.log("recipeEquipments: ", recipeEquipments);
        console.log("Equipments: ", recipeEquipments);

        for (let k = 0; k < recipeEquipments.length; k++) {
            //preventind the DOM to repeating equipments.
            if (!equipmentArray.includes(recipeEquipments[k].name)) {
                equipmentArray.push(recipeEquipments[k].name);
                let para = document.createElement("li");
                let newPara = recipeEquipments[k].name;
                para.innerHTML = newPara;
                equipmentsElmnt.appendChild(para);
            }
        }
        if (equipmentArray.length === 0) {
            equipmentsElmnt.innerHTML = " ";
        }
        stepsElmnt.innerHTML = " ";
        stepsElmnt.innerHTML = `<h2>Steps</h2>`;
        let ol = document.createElement("ol");

        for (let i = 0; i < recipeSteps.length; i++) {
            let para = document.createElement("li");
            let newPara = recipeSteps[i].step;
            para.innerHTML = newPara;
            ol.appendChild(para);
            stepsElmnt.appendChild(ol);
        }

    };

    getRecipeBtn.setAttribute("class", "get-btn");
    getRecipeBtn.addEventListener("click", getRecipeFn);
    img.setAttribute("src", data.image);
    title.innerHTML = data.title;
    getRecipeBtn.innerHTML = "Get Recipe";
    item.appendChild(img);
    item.appendChild(title);
    item.appendChild(getRecipeBtn);
    cardElmnt.appendChild(item);
};


