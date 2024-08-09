const orders = [];

class Order {
  constructor(id, userId, items) {
    this.id = id;
    this.userId = userId;
    this.items = items;
  }

  static findAll() {
    return orders;
  }

  static findById(id) {
    return orders.find(order => order.id === id);
  }

  static create(order) {
    orders.push(order);
    return order;
  }

  static update(id, updatedOrder) {
    const index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
      orders[index] = updatedOrder;
      return updatedOrder;
    }
    return null;
  }

  static delete(id) {
    const index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
      return orders.splice(index, 1);
    }
    return null;
  }
}

module.exports = Order;
