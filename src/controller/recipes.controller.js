const Recipe = require("../model/Recipe.model");

exports.getRecipesPage = (req, res) => {
  //create our own callback process
  Recipe.fetchAll((fetchRecipes) => {
    res.render("recipes", {
      title: "Recipes List",
      recipes: fetchRecipes
    });
  });
};

exports.getRecipeById = (req, res) => {
  const fetchRecipe = Recipe.fetchRecipeById(req.params.id);
  if (fetchRecipe.msg) {
    res.render("400", {
      title: "Recipe Not Found",
      message: fetchRecipe.msg
    });
  } else {
    res.json(fetchRecipe);
  }
};

exports.getAddRecipePage = (req, res) => {
  res.render("create", { title: "Add Recipe" });
};

exports.postAddRecipe = (req, res) => {
  let { name, ingredients, quantity, instructions } = req.body;

  //check if ingredient is an array
  if (!Array.isArray(ingredients)) {
    ingredients = [ingredients];
  }

  //check if quantity is an array
  if (!Array.isArray(quantity)) {
    quantity = [quantity];
  }

  //remap ingredients and quantities to an array of objects
  const reMappedIngredients = ingredients.map((ingredient, index) => {
    return {
      name: ingredient,
      quantity: quantity[index]
    };
  });

  //check if instructions is an array
  if (!Array.isArray(instructions)) {
    instructions = [instructions];
  }

  const newRecipe = new Recipe(name, reMappedIngredients, instructions);
  newRecipe.save(({ message, status }) => {
    if (status === 200) {
      res.redirect("/recipes");
    } else {
      res.status(status).send(message);
    }
  });
};

exports.getEditRecipe = (req, res) => {
  const fetchRecipe = Recipe.fetchRecipeById(req.params.id);
  if (fetchRecipe.msg) {
    res.render("400", {
      title: "Recipe Not Found",
      message: fetchRecipe.msg
    });
  } else {
    res.render("edit", { title: "Edit Recipe", recipe: fetchRecipe });
  }
}

exports.putEditRecipe = (req, res) => {
  let { name, ingredients, quantity, instructions } = req.body;

  //check if ingredient is an array
  if (!Array.isArray(ingredients)) {
    ingredients = [ingredients];
  }

  //check if quantity is an array
  if (!Array.isArray(quantity)) {
    quantity = [quantity];
  }

  //remap ingredients and quantities to an array of objects
  const reMappedIngredients = ingredients.map((ingredient, index) => {
    return {
      name: ingredient,
      quantity: quantity[index]
    };
  });

  //check if instructions is an array
  if (!Array.isArray(instructions)) {
    instructions = [instructions];
  }

  const updatedRecipe = {
    id: +req.params.id,
    name,
    ingredients: reMappedIngredients,
    instructions
  }

  Recipe.updateRecipeById(updatedRecipe, ({ message, status }) => {
      if (status === 200) {
        res.redirect("/recipes");
      } else {
        res.status(status).send(message);
      }
  });
}

exports.deleteRecipe = (req,res) => {
  Recipe.deleteRecipeById(req.params.id, ({ message, status }) => {
    if (status === 200) {
      res.redirect("/recipes")
    } else {
      res.render("404", { title: "Recipe Not Found", message });
    }
  });
  
}