Description:
Ruang Kopi is a coffee shop that serves customers (general and coffee lovers) using a website to place orders (paperless). where, customers will open an interactive website or scan qr at the table to see the menu, menu information, and place orders. There are still shortcomings on this website, because when migrating to the database there is still an error, so registration or login is still constrained. However, you can log in using the "as Guest" account. This website is still under development for the future.

data structure:
ruang kopi-website/
│
├── controllers/
│ └── userController.js
│ └── productController.js
│ └── orderController.js
│
├── models/
│ └── user.js
│ └── product.js
│ └── order.js
│
├── services/
│ └── userService.js
│ └── productService.js
│ └── orderService.js
│
├── package.json
└── index.js
