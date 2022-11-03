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

function getDishes(request, response, next) {
  const dishId = request.params.dishId;
  const dishWeWant = dishes.find((dish) => dishId == dish.id);
  response.status(200).json({ data: dishWeWant });
}

module.exports = { create: [isDataValid, createDish], get: [getDishes] };
