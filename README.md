Description:
Ruang Kopi is a coffee shop that serves customers (general and coffee lovers) by using a website to place orders (paperless). where, customers will open an interactive website or scan the qr on the table to see the menu, menu information, and place an order. There are still shortcomings on this website, because when migrating to the database there is still an error, so registration or login is still constrained, and in the checkout order section there are still bugs and errors when converting prices (strings) into numbers (integers). For the problem of handling get data http://localhost:3000/orders/:orderId/checkout has been solved However, you can log in using the "as Guest" account. This website is still under development for the future.

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
