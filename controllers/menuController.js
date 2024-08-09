const Menu = require('../models/menuModel');

class MenuController {
  static getAllMenus(req, res) {
    res.json(Menu.findAll());
  }

  static getMenusByCategory(req, res) {
    const category = req.params.category;
    const menus = Menu.findByCategory(category);
    if (menus.length > 0) {
      res.json(menus);
    } else {
      res.status(404).json({ message: 'No menus found in this category' });
    }
  }

  static getMenuById(req, res) {
    const menu = Menu.findById(req.params.id);
    if (menu) {
      res.json(menu);
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  }

  static createMenu(req, res) {
    const newMenu = new Menu(Date.now().toString(), req.body.name, req.body.description, req.body.price);
    Menu.create(newMenu);
    res.status(201).json(newMenu);
  }

  static updateMenu(req, res) {
    const updatedMenu = new Menu(req.params.id, req.body.name, req.body.description, req.body.price);
    const menu = Menu.update(req.params.id, updatedMenu);
    if (menu) {
      res.json(menu);
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  }

  static deleteMenu(req, res) {
    const menu = Menu.delete(req.params.id);
    if (menu) {
      res.json({ message: 'Menu deleted' });
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  }
}

module.exports = MenuController;
