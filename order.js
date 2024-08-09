// Function to fetch and display orders
function fetchAndDisplayOrders() {
  const ordersContainer = document.getElementById('ordersContainer');

  fetch('http://localhost:3000/orders')
  .then(response => response.json())
  .then(orders => {
    console.log('Fetched orders:', orders); // Debugging line
    ordersContainer.innerHTML = '';
    if (orders.length === 0) {
      ordersContainer.innerHTML = '<p>No orders found.</p>';
    } else {
      orders.forEach(order => {
        // Ensure 'order_date' and other properties exist
        const orderDate = order.order_date ? new Date(order.order_date).toLocaleString() : 'Date not available';
        const orderItems = order.items.map(item => `
          <li>${item.menuName || 'Item name not available'} (x${item.quantity || 'N/A'}) - harga Rp. ${item.menuPrice || 'Price not available'}</li>
        `).join('');

        const orderItem = `
          <div class="order-item">
            <h3>Order ID: ${order.id || 'ID not available'}</h3>
            <p>Date: ${orderDate}</p>
            <p>User: ${order.customerName || 'Guest'}</p>
            <ul>
              ${orderItems}
            </ul>
          </div>
        `;
        ordersContainer.innerHTML += orderItem;
      });
    }
  })
    .catch(error => console.error('Error fetching orders:', error));
}

fetchAndDisplayOrders('My Orders', 'ordersContainer');