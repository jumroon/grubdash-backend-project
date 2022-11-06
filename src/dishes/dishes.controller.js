const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function createDish(request, response) {
  const id = nextId();
  const incomingData = request.body.data;
  const newData = {
    id,
    name: incomingData.name,
    description: incomingData.description,
    image_url: incomingData.image_url,
    price: incomingData.price,
  };
  dishes.push(newData);
  response.status(201).json({ data: newData });
}

function isDataValid(request, response, next) {
  const { name, description, image_url, price } = request.body.data;
  if (!name || !description || !image_url || !price || price < 0) {
    response.status(400).json({
      error: "name, description, price and image_url must all correct",
    });
  }
  next();
}

function getDish(request, response) {
  const dishId = request.params.dishId;
  response.status(200).json({ data: response.locals.dish });
}

function doesDishExist(request, response, next) {
  const dishId = request.params.dishId;
  const dishWeWant = dishes.find((dish) => dishId == dish.id);
  if (!dishWeWant) {
    response.status(404).json({ error: dishId });
  }
  response.locals.dish = dishWeWant;
  next();
}

function updateDishById(request, response) {
  const { dishId } = request.params;
  const dishWeWant = dishes.find((dish) => dishId == dish.id);
  const { name, description, image_url, price } = request.body.data;
  dishWeWant.name = name;
  dishWeWant.description = description;
  dishWeWant.image_url = image_url;
  dishWeWant.price = price;
  response.status(200).json({ data: dishWeWant });
}

function validateDishIdRouter(request, response, next) {
  const { dishId } = request.params;
  const requestId = request.body.data.id;
  if (dishId === requestId || !requestId) {
    next();
  } else {
    response.status(400).json({ error: `invalid id: ${requestId}` });
  }
  next();
}

function validateData(request, response, next) {
  const data = request.body.data;
  console.log("REQUEST BODY DATA: ", request.body.data);
  console.log("REQUEST BODY PRICE: ", typeof data.price !== "number");
  if (
    !data.name ||
    !data.description ||
    !data.image_url ||
    !data.price ||
    typeof data.price !== "number" ||
    data.price < 0
  ) {
    response.status(400).json({
      error:
        "name, description, image_url, price field must exist and be valid",
    });
  }
  next();
}

function getListOfDishes(request, response) {
  response.status(200).json({ data: dishes });
}

module.exports = {
  create: [isDataValid, createDish],
  get: [doesDishExist, getDish],
  update: [doesDishExist, validateDishIdRouter, validateData, updateDishById],
  getDishes: [getListOfDishes],
};
