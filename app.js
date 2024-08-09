document.addEventListener('DOMContentLoaded', () => {
  let cartItemCount = 0;

  function fetchAndDisplayMenus(category, containerId) {
    const menuList = document.getElementById(containerId);

    fetch(`http://localhost:3000/menus/category/${category}`)
      .then(response => response.json())
      .then(menus => {
        menuList.innerHTML = ''; 
        menus.forEach(menu => {
          const menuItem = `
            <div class="menu-item">
              <div class="item">
                <img src="${menu.image}" alt="${menu.name}">
                <div class="content">
                  <h3>${menu.name}</h3>
                  <p>${menu.description}</p>
                  <p class="price">Rp.${menu.price}</p>
                </div>
              </div>
              <button class="btn-order" data-menu-id="${menu.id}" data-menu-name="${menu.name}"
               data-menu-price=${menu.price}>Add to Cart</button>
            </div>
          `;
          menuList.innerHTML += menuItem;
        });

        const orderButtons = document.querySelectorAll('.btn-order');
        orderButtons.forEach(button => {
          button.addEventListener('click', () => {
            const menuId = button.getAttribute('data-menu-id');
            const menuName = button.getAttribute('data-menu-name');
            const menuPrice = button.getAttribute('data-menu-price');
            orderMenu(menuId, menuName, menuPrice);
          });
        });
      })
      .catch(error => console.error('Error fetching menus:', error));
  }

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

// Ensure this function call is present after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchAndDisplayOrders);

function generateOrderId(menuId) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  const randomNum = Math.floor(Math.random() * 10000);
  return `${dateStr}-${menuId}-${randomNum}`;
}

// Function to place an order
function orderMenu(menuId, menuName, menuPrice) {
  const orderId = generateOrderId(menuId);

  fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId: orderId, 
      customerId: 'guest',
      items: [{ menuId: menuId, menuName, quantity: 1, menuPrice }],
    }),
  })
  .then(response => response.json())
  .then(data => {
    cartItemCount++;
    updateCartNotification(cartItemCount);

    alert(`Order placed successfully!\nOrder ID: ${orderId}\nItem: ${menuName}\nQuantity: 1 \nPrice: ${menuPrice}`);
  })
  .catch(error => console.error('Error placing order:', error));
}

// Call fetchAndDisplayOrders when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayOrders);

  function updateCartNotification(count) {
    const cartNotification = document.querySelector('.cart-notification');
    cartNotification.textContent = count;
  }

  fetchAndDisplayMenus('Coffee', 'coffeeMenuList');
  fetchAndDisplayMenus('Non-Coffee', 'nonCoffeeMenuList');
  fetchAndDisplayOrders('My Orders', 'ordersContainer');

  const exploreButton = document.querySelector('.btn-explore');
  exploreButton.addEventListener('click', (event) => {
    event.preventDefault();
    const targetElement = document.querySelector(event.target.getAttribute('href'));

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  });

  // Display welcome message based on user status
  const welcomeMessage = document.getElementById('welcomeMessage');
  const loginLink = document.getElementById('loginLink');

  // Simulate checking user's status (logged in or guest)
  const userStatus = localStorage.getItem('userStatus'); // 'loggedIn' or 'guest'

  if (userStatus === 'loggedIn') {
    welcomeMessage.innerHTML = '<h1>Welcome back, valued customer!</h1>';
    loginLink.style.display = 'none'; // Hide login link for logged in users
  } else {
    welcomeMessage.innerHTML = '<h1>Welcome, guest!</h1><p>Consider signing up to earn points with every purchase.</p>';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Perform form validation
    if (!username || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }

    // Simulate saving the user to a database
    const newUser = {
      username: username,
      email: email,
      password: password // In a real application, ensure to hash the password before saving
    };

    console.log('User registered:', newUser);

    // Simulate saving the user status to localStorage
    localStorage.setItem('userStatus', 'loggedIn');
    localStorage.setItem('username', username);

    // Redirect to the dashboard page after successful registration
    window.location.href = 'index.html';
  });
});
