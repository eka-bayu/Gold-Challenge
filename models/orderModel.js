const orders = [];

class Order {
  constructor(orderId, userId, items, orderDate = new Date) {
    this.id = orderId;
    this.userId = userId;
    this.items = items;
    this.orderDate = orderDate;
  }

  static findAll() {
    console.log (orders);
    return orders;
  }

  static findById(id) {
    console.log (id);
    console.log (orders);
    return orders.find(order => order.orderId === id);
    // return orders.find(({orderId}) => orderId === id);
    // return orders.find(({orderId: idOrder}) => idOrder === id);
  }

  static create(order) {
    orders.push(order);
    return order;
  }

  static update(id, updatedOrder) {
    const index = orders.findIndex(order => order.orderId === id);
    if (index !== -1) {
      orders[index] = updatedOrder;
      return updatedOrder;
    }
    return null;
  }

  static delete(id) {
    const index = orders.findIndex(order => order.orderId === id);
    if (index !== -1) {
      return orders.splice(index, 1);
    }
    return null;
  }

  static checkoutOrder(id) {
    const order = this.findById(id);
    console.log(order);
    if (!order) {
      return null;
    }
  
    const totalPrice = order.items.reduce((sum, item) => {
      const itemPrice = parseInt(item.menuPrice, 10);
      return sum + (itemPrice * item.quantity);
    }, 0);
  
    console.log(totalPrice);
    return totalPrice;
  }
}

module.exports = Order;
