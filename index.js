const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/menus', menuRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Coffee Shop API');
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
