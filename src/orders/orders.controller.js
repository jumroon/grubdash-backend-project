const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function createOrder(request, response) {
  const id = nextId();
  const incomingData = request.body.data;
  const newData = {
    id,
    deliverTo: incomingData.deliverTo,
    mobileNumber: incomingData.mobileNumber,
    status: incomingData.status,
    dishes: incomingData.dishes,
  };
  orders.push(newData);
  response.status(201).json({ data: newData });
}

function validateData(request, response) {
  const incomingData = request.body.data;
}

module.exports = { post: [createOrder] };
