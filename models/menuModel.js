const menus = [
  {
    id: 1,
    name: 'Americano',
    description: 'Espresso with hot water',
    price: 25000,
    image: './image/americano.jpg',
    category: 'Coffee'
  },
  {
    id: 2,
    name: 'Latte',
    description: 'Espresso with steamed milk',
    price: 30000,
    image: './image/latte.jpg',
    category: 'Coffee'
  },
  {
    id: 3,
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 30000,
    image: './image/cappucino.jpg',
    category: 'Coffee'
  },
  {
    id: 4,
    name: 'Espresso',
    description: 'Strong black coffee',
    price: 20000,
    image: './image/espresso.jpg',
    category: 'Coffee'
  },
  {
    id: 5,
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    price: 35000,
    image: './image/mocha.jpg',
    category: 'Coffee'
  },
  {
    id: 6,
    name: 'Cold Brew',
    description: 'Slow-steeped, small-batch and smooth',
    price: 21000,
    image: './image/cold-brew.jpg',
    category: 'Coffee'
  },
  {
    id: 7,
    name: 'Green Tea Latte',
    description: 'Matcha green tea with steamed milk',
    price: 30000,
    image: './image/green-tea.jpg',
    category: 'Non-Coffee'
  },
  {
    id: 8,
    name: 'Hot Chocolate',
    description: 'Steamed milk with mocha-flavored syrup',
    price: 28000,
    image: './image/hot chocolate.jpg',
    category: 'Non-Coffee'
  },
  {
    id: 9,
    name: 'Caramel Frappuccino',
    description: 'Blended coffee with caramel syrup',
    price: 35000,
    image: './image/caramel.jpg',
    category: 'Non-Coffee'
  },
  {
    id: 10,
    name: 'Chicken Sandwich',
    description: 'Grilled chicken with fresh veggies',
    price: 47000,
    image: './image/sandwitch.jpg',
    category: 'Food & Snack'
  },
  {
    id: 11,
    name: 'Croissant',
    description: 'Buttery and flaky croissant',
    price: 20000,
    image: './image/croissant.jpg',
    category: 'Food & Snack'
  },
  {
    id: 12,
    name: 'Muffin',
    description: 'Blueberry muffin',
    price: 21000,
    image: './image/cupcake.jpg',
    category: 'Food & Snack'
  },
  {
    id: 13,
    name: 'Peppermint Mocha',
    description: 'Espresso with peppermint flavor and chocolate',
    price: 24000,
    image: './image/latte.jpg',
    category: 'Seasonal'
  },
  {
    id: 14,
    name: 'Seasonal Pumpkin Latte',
    description: 'Espresso with pumpkin spice flavor',
    price: 27000,
    image: './image/latte.jpg',
    category: 'Seasonal'
  }

];

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

module.exports = Menu;
