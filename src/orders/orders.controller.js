const { response } = require("express");
const path = require("path");
const { isArray } = require("util");

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

function validateData(request, response, next) {
  const data = request.body.data;
  if (
    !data.deliverTo ||
    !data.mobileNumber ||
    !data.dishes ||
    data.dishes.length === 0 ||
    !Array.isArray(data.dishes)
  ) {
    response
      .status(400)
      .json({ error: `deliverTo, mobileNumber, dishes must be valid` });
  } else {
    next();
  }
}

function validateDishQuantity(request, response, next) {
  const dishes = request.body.data.dishes;
  const dishQuantities = dishes.forEach((dish) => {
    const dishQuantity = dish.quantity;
    if (!dishQuantity || typeof dishQuantity !== "number") {
      response.status(400).json({
        error: `Dish ${dishes.indexOf(
          dish
        )} quantity must be integer greater than 0`,
      });
    }
  });
  next();
}

function getOrderById(request, response) {
  const orderId = request.params.orderId;
  const orderWeWant = orders.find((order) => orderId == order.id);
  if (orderWeWant) {
    response.status(200).json({ data: orderWeWant });
  } else {
    response.status(404).json({ error: `order does not exist` });
  }
}

function doesOrderExist(request, response, next) {
  const orderId = request.params.orderId;
  const orderWeWant = orders.find((order) => orderId == order.id);
  if (orderWeWant) {
    next();
  } else {
    response.status(404).json({ error: `order does not exist` });
  }
}

function updateOrderById(request, response) {
  const { orderId } = request.params;
  const orderWeWant = orders.find((order) => orderId == order.id);
  const { id, deliverTo, mobileNumber, status, dishes } = request.body.data;
  // orderWeWant.id = id;
  orderWeWant.deliverTo = deliverTo;
  orderWeWant.mobileNumber = mobileNumber;
  orderWeWant.status = status;
  orderWeWant.dishes = dishes;
  response.status(200).json({ data: orderWeWant });
}

function validateOrderIdRouter(request, response, next) {
  const { orderId } = request.params;
  const requestId = request.body.data.id;
  if (orderId === requestId || !requestId) {
    next();
  } else {
    response.status(400).json({ error: `request id ${requestId} invalid` });
  }
}

function validateStatus(request, response, next) {
  console.log("xxxx");
  next();
}

module.exports = {
  post: [validateData, validateDishQuantity, createOrder],
  getOrders: [getOrderById],
  put: [
    doesOrderExist,
    validateOrderIdRouter,
    validateData,
    validateDishQuantity,
    updateOrderById,
    validateStatus,
  ],
};
