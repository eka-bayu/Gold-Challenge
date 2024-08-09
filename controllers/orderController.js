const Order = require('../models/orderModel');
const Menu = require('../models/menuModel');

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll(); 
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  }

  static async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id); 
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error });
    }
  }

  static async createOrder(req, res) {
    const { userId, items } = req.body;
    console.log('Received order request with:', { userId, items });

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items should be an array' });
    }

    const invalidItems = [];
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuId);
      if (!menuItem) {
        invalidItems.push(item.menuId);
      }
    }
    
    if (invalidItems.length > 0) {
      return res.status(400).json({ message: 'Invalid menu items in order', invalidItems });
    }

    try {
      const newOrder = await Order.create({ userId, items }); 
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  }

  static async updateOrder(req, res) {
    const { userId, items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items should be an array' });
    }

    // Validate items
    const invalidItems = [];
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuId);
      if (!menuItem) {
        invalidItems.push(item.menuId);
      }
    }

    if (invalidItems.length > 0) {
      return res.status(400).json({ message: 'Invalid menu items in order', invalidItems });
    }

    try {
      const updatedOrder = await Order.update(req.params.id, { userId, items }); 
      if (updatedOrder) {
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating order', error });
    }
  }

  static async deleteOrder(req, res) {
    try {
      const order = await Order.delete(req.params.id);
      if (order) {
        res.json({ message: 'Order deleted' });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order', error });
    }
  }
}

module.exports = OrderController;
