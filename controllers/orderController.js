const Order = require('../models/orderModel');
const Menu = require('../models/menuModel');
const orderId = generateOrderId();
const orderDate = new Date();
const invalidItems = [];

function generateOrderId() {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  const randomNum = Math.floor(Math.random() * 10000);
  return `ORD-${dateStr}-${randomNum}`;
}

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
      const orderId = req.params.id;
      console.log(`Fetching order with order ID: ${orderId}`);
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
    const { userId,orderId, items } = req.body;
    console.log('Received order request with:', { userId, orderId, items });

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items should be an array' });
    }

    const orders = [];
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuId);
      if (!menuItem) {
        orders.push(item.menuId);
      }
    }
    
    if (orders.length === 0) {
      return res.status(400).json({ message: 'Invalid menu items in order', invalidItems });
    }

    try {
      const newOrder = await Order.create({ orderId, userId, items, orderDate }); 
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  }

  // Update item quantity in an order
  static async updateItemQuantity(req, res) {
  const { orderId, menuId } = req.params;
  const { quantityChange } = req.body;

  try {
    const order = await Order.findById(orderId);
    console.log(`${order}`);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = order.items.find(item => item.menuId === menuId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    item.quantity += quantityChange;
    if (item.quantity <= 0) {
      order.items = order.items.filter(item => item.menuId !== menuId);
    }

    await Order.update(orderId, order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item quantity', error });
  }
}

  // Delete an item from an order
  static async deleteOrderItem(req, res) {
  const { orderId, menuId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.items = order.items.filter(item => item.menuId !== menuId);
    await Order.update(orderId, order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
}


  static async updateOrder(req, res) {
    const { userId, items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items should be an array' });
    }

    // Validate items
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

  static async checkoutOrder(req, res) {
    try {
      const { orderId } = req.params;
      console.log(`Fetching order with order ID: ${orderId}`);
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      } 
  
      if (!Array.isArray(order.items)) {
        console.error('Order items is not an array');
        return res.status(500).json({ success: false, message: 'Invalid order data' });
      }
  
      const totalPrice = order.items.reduce((sum, item) => {
        const itemPrice = parseInt(item.itemPrice, 10) || 0;
        const quantity = item.quantity || 0;
        return sum + (itemPrice * quantity);
      }, 0);

      res.json({ success: true});
      
    } catch (error) {
      console.error('Error checking out order:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }  
}

module.exports = OrderController;
