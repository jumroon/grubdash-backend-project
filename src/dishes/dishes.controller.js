const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function createDish(request, response, next) {
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

function isDataComplete(request, response, next) {
  const { name, description, image_url } = request.body.data;
  if (!name || !description || !image_url) {
    response
      .status(400)
      .json({ error: "name, description and image_url must all be defined" });
  }
  next();
}

module.exports = { create: [isDataComplete, createDish] };
