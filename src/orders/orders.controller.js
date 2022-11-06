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
    response.locals.data = data;
    next();
  }
}

function validateDishQuantity(request, response, next) {
  const dishes = response.locals.data.dishes;
  dishes.forEach((dish, index) => {
    const dishQuantity = dish.quantity;
    if (!dishQuantity || typeof dishQuantity !== "number") {
      response.status(400).json({
        error: `Dish ${index} quantity must be integer greater than 0`,
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
    response.locals.orderId = orderId;
    response.locals.order = orderWeWant;
    next();
  } else {
    response.status(404).json({ error: `order not found: ${orderId}` });
  }
}

function updateOrderById(request, response) {
  const { id, deliverTo, mobileNumber, status, dishes } = request.body.data;
  response.locals.order.deliverTo = deliverTo;
  response.locals.order.mobileNumber = mobileNumber;
  response.locals.order.status = status;
  response.locals.order.dishes = dishes;
  response.status(200).json({ data: response.locals.order });
}

function validateOrderId(request, response, next) {
  const requestId = request.body.data.id;
  if (response.locals.orderId === requestId || !requestId) {
    next();
  } else {
    response.status(400).json({ error: `request id ${requestId} invalid` });
  }
}

function validateStatus(request, response, next) {
  if (
    !response.locals.data.status ||
    response.locals.data.status === "invalid"
  ) {
    response.status(400).json({ error: `status not valid` });
  }
  next();
}

function deleteOrder(request, response) {
  const { orderId } = request.params;
  const orderWeWant = orders.find((order) => orderId == order.id);
  const index = orders.indexOf(orderWeWant);
  orders.splice(index, 1);
  response.status(204).json({ data: orders });
}

function statusCannotBePending(request, response, next) {
  const { status = null } = response.locals.order;
  if (status !== "pending") {
    response.status(400).json({ error: `only pending orders can be deleted` });
  } else {
    next();
  }
}

function getListOfOrders(request, response) {
  response.status(200).json({ data: orders });
}

module.exports = {
  post: [validateData, validateDishQuantity, createOrder],
  getOrders: [getOrderById],
  put: [
    doesOrderExist,
    validateOrderId,
    validateData,
    validateDishQuantity,
    validateStatus,
    updateOrderById,
  ],
  delete: [doesOrderExist, statusCannotBePending, deleteOrder],
  getOrderList: [getListOfOrders],
};
