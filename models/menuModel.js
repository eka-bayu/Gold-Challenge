class Menu {
  constructor(id, name, description, price, image, category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
    this.category = category;
  }

  getFormattedPrice() {
    return `Rp. ${this.price.toLocaleString('id-ID')}`;
  }

  static findAll() {
    return menus;
  }

  static findById(id) {
    return menus.find(menu => menu.id === id);
  }

  static findByCategory(category) {
    return menus.filter(menu => menu.category === category);
  }
}

const menus = [
  new Menu(1, 'Americano', 'Espresso with hot water', 25000, './image/americano.jpg', 'Coffee'),
  new Menu(2, 'Latte', 'Espresso with steamed milk', 30000, './image/americano.jpg', 'Coffee'),
  new Menu(3, 'Cappuccino', 'Espresso with steamed milk foam', 30000, './image/americano.jpg', 'Coffee'),
  new Menu(4, 'Espresso', 'Strong black coffee', 20000, './image/americano.jpg', 'Coffee'),
  new Menu(5, 'Mocha', 'Espresso with chocolate and steamed milk', 35000, './image/americano.jpg', 'Coffee'),
  new Menu(6, 'Cold Brew', 'Slow-steeped, small-batch and smooth', 21000, './image/americano.jpg', 'Coffee'),
  new Menu(7, 'Green Tea Latte', 'Matcha green tea with steamed milk', 30000, './image/latte.jpg', 'Non-Coffee'),
  new Menu(8, 'Hot Chocolate', 'Steamed milk with mocha-flavored syrup', 28000, './image/latte.jpg', 'Non-Coffee'),
  new Menu(9, 'Caramel Frappuccino', 'Blended coffee with caramel syrup', 35000, './image/latte.jpg', 'Non-Coffee')
];

module.exports = Menu;
