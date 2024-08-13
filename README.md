Description:
Ruang Kopi is a coffee shop that serves customers (both the general public and coffee enthusiasts) through a paperless website for ordering. Customers can either open an interactive website or scan a QR code on the table to view the menu, get information about menu items, and place orders.
The website still has some issues. During database migration, errors occurred, affecting registration and login functionalities. The checkout process for orders has been resolved, but there is a bug where only the first item in the order is displayed for its price when using the GET API at http://localhost:3000/orders/:orderId. While the issue with handling GET requests at http://localhost:3000/orders/:orderId/checkout has been resolved, users can still log in as a "Guest." The website is still under development and improvements are ongoing.

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
