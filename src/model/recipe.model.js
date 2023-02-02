const fs = require("fs");
const path = require("path");

const recipes = require("../data/recipes.json");
const rootDirectory = require.main.path;
const dataPath = path.join(rootDirectory, "data", "recipes.json");

module.exports = class Recipe {
  constructor(name, ingredients, instructions) {
    this.id = recipes.length + 1;
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
  }

  save(cb) {
    // Read existing JSON file
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        cb({ message: "Could not read recipes file", status: 500 });
        // return { message: "Could not read recipes file", status: 500 };
        // res.status(500).json({ error: "Could not read recipes file" });
      } else {
        // Parse JSON data
        let recipes = JSON.parse(data);
        // Add new recipe to array
        recipes.push(this);
        // Write new data to JSON file

        let result = {};
        fs.writeFile(
          dataPath,
          JSON.stringify(recipes, null, 2),
          "utf8",
          (err) => {
            if (err) {
              cb({ message: "Could not write to recipes file", status: 500 });
              //   result = { message: "Could not write to recipes file", status: 500};
              //   res.status(500) .json({ error: "Could not write to recipes file" });
            } else {
              cb({ message: "Recipe added successfully", status: 200 });
              //   result = { message: "Recipe added successfully", status: 200 };
              //   res.status(200).json({ message: "Recipe added successfully" });
            }
          }
        );
      }
    });
  }

  //static - call the method directly and not have to be instantiated
  static fetchAll(cb) {
    //pass a function into fetchAll once this is done, which calls another function to retrieve the data we want

    //this is asynchronous
    fs.readFile(dataPath, (err, data) => {
      if (err) {
        //return []; //instead of returning an array, we use a the callback to pass in the array.
        cb([]); //execute this argument as a function to which we pass an empty array
      } else {
        cb(JSON.parse(data));
      }
    });
  }

  static fetchAllSync() {
    return JSON.parse(fs.readFileSync(dataPath));
  }

  static fetchRecipeById(id) {
    const recipes = JSON.parse(fs.readFileSync(dataPath));
    const found = recipes.some((recipe) => recipe.id === parseInt(id));

    if (found) {
      return recipes.find((k) => k.id == id);
    } else {
      return { msg: `Product with id of (${id}) is not found.` };
    }
  }

  static updateRecipeById(recipeToUpdate, callback) {
    const recipes = JSON.parse(fs.readFileSync(dataPath));
    const found = recipes.some((recipe) => recipe.id === recipeToUpdate.id); 

    if(found){
      const updatedRecipes = recipes.map((recipe) => {
        if(recipe.id === recipeToUpdate.id){
          return recipeToUpdate;
        }

        return recipe;
      });

      fs.writeFileSync(dataPath, JSON.stringify(updatedRecipes, null, 2))
      callback({
        message:`Recipe with id of (${recipeToUpdate.id}) is updated.`,
        status: 200
      })
    }else{
      callback({ 
        message: `Recipe with id of (${recipeToUpdate.id}) is not found.`, 
        status: 404
      })
    }
  }

  static deleteRecipeById(id, callback) {
    const recipes = JSON.parse(fs.readFileSync(dataPath));
    const found = recipes.some((recipe) => recipe.id === +id); 
    
    if (found) {
      const updatedRecipe = recipes.filter((recipe) => recipe.id !== +id);
      fs.writeFileSync(dataPath, JSON.stringify(updatedRecipe, null, 2))
      callback({
        message:`Recipe with id of (${id}) is deleted.`,
        status: 200
      })
    }else{
      callback({ 
        message: `Recipe with id of (${id}) is not found.`, 
        status: 404
      })
    }
  }
};
