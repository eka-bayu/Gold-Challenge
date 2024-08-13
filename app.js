document.addEventListener('DOMContentLoaded', () => {

  fetchAndDisplayAllMenus();
  fetchAndDisplayOrders();

    function fetchAndDisplayAllMenus() {
      const categories = [
        { category: 'Coffee', containerId: 'coffeeMenuList' },
        { category: 'Non-Coffee', containerId: 'nonCoffeeMenuList' },
        { category: 'Food & Snack', containerId: 'foodMenuList' },
        { category: 'Seasonal', containerId: 'seasonalMenuList' }
      ];
    
      categories.forEach(({ category, containerId }) => {
        fetchAndDisplayMenus(category, containerId);
      });
    }
  
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
                    <p class="price">Rp. ${menu.price}</p>
                  </div>
                </div>
                <button class="btn-order" data-menu-id="${menu.id}" data-menu-name="${menu.name}"
                 data-menu-price=${menu.price}>Add to Cart</button>
              </div>
            `;
            menuList.innerHTML += menuItem;
          });
      })
      .catch(error => console.error('Error fetching menus:', error));
  }

  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-order')) {
      const button = event.target;
      const menuId = button.getAttribute('data-menu-id');
      const menuName = button.getAttribute('data-menu-name');
      const menuPrice = button.getAttribute('data-menu-price');
      orderMenu(menuId, menuName, menuPrice);
    }
  });

  function generateOrderId() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const randomNum = Math.floor(Math.random() * 10000);
    return `${dateStr}-${randomNum}`;
  }
  
  function orderMenu(menuId, menuName, menuPrice) {
    // Ambil orderId dari localStorage atau buat yang baru jika tidak ada
    let orderId = localStorage.getItem('activeOrderId');
    
    if (!orderId) {
      orderId = generateOrderId();
      localStorage.setItem('activeOrderId', orderId);
    }
  
    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId, 
        userId: 'guest',
        items: [{ menuId: menuId, menuName, quantity: 1, menuPrice }],
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error placing order: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      cartItemCount++;
      localStorage.setItem('cartItemCount', cartItemCount);
      updateCartNotification(cartItemCount);
  
      alert(`Order placed successfully!\nOrder ID: ${orderId}\nItem: ${menuName}\nQuantity: 1 \nPrice: ${menuPrice}`);
    })
    .catch(error => console.error('Error placing order:', error));
  }
  

  function updateCartNotification(count) {
    const cartNotification = document.querySelector('.cart-notification');
    cartNotification.textContent = count;
  }

  const exploreButtons = document.querySelectorAll('.btn-explore, .btn-coffee, .btn-nonCoffee, .btn-food, .btn-seasonal');
  exploreButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const targetElement = document.querySelector(event.target.getAttribute('href'));

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});


function fetchAndDisplayOrders() {
  const ordersContainer = document.getElementById('ordersContainer');

  fetch('http://localhost:3000/orders')
  .then(response => response.json())
  .then(orders => {
     ordersContainer.innerHTML = '';
    if (orders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="no-orders">
          <img src="../public/image/empty-cart.jpg" alt="No orders found" class="no-orders-image">
          <p>No orders found.</p>
          <a href="index.html" class="btn-home">Back to Home</a>
        </div>`;
     }

    const orderMap = {};

    orders.forEach(order => {
      if (!orderMap[order.orderId]) {
        orderMap[order.orderId] = {
          orderDate: order.orderDate,
          userName: order.userName,
          items: []
        };
      }

      order.items.forEach(item => {
        orderMap[order.orderId].items.push(item);
      });
    });

    Object.keys(orderMap).forEach(orderId => {
      const order = orderMap[orderId];
      const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Date not available';
      const orderItems = order.items.map(item => `
        <li class="order-list" data-menu-id="${item.menuId}">
          ${item.menuName || 'Item name not available'} - Rp. ${item.menuPrice || 'Price not available'}
          <div class="button-order">
            <button class="remove-item">-</button>
            <span class="quantity-display">${item.quantity || 0}</span>
            <button class="add-item">+</button>
            <button class="delete-item">Delete</button>
          </div>
        </li>
      `).join('');

      const orderItemHTML = `
        <div class="order-item" data-order-id="${orderId}">
          <h3>Order ID: ${orderId || 'ID not available'}</h3>
          <p>Date: ${orderDate}</p>
          <p>User: ${order.userName || 'Guest'}</p>
          <ul>
            ${orderItems}
          </ul>
          <div class="checkout-order">
            <p>Total Harga: Rp. <span class="order-total">0</span></p>
            <button class="btn-checkout">Checkout Order</button>
          </div>
          <div id="checkout-popup" class="popup">
            <div class="popup-content">
              <span class="close-popup">&times;</span>
              <h3>Order Confirmation</h3>
              <p>Order ID: <span id="popup-order-id"></span></p>
              <p>Total Price: Rp. <span id="popup-total-price"></span></p>
              <p>Saat ini, sistem pembayaran QR Code masih dalam pengembangan,
              silakan pergi ke kasir untuk melakukan pembayaran.</p>
              <button class="btn-close-popup">Close</button>
            </div>
          </div>
        </div>
      `;
      ordersContainer.innerHTML += orderItemHTML;
    });

    document.querySelectorAll('.add-item').forEach(button => {
      button.addEventListener('click', handleAddItem);
    });
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', handleRemoveItem);
    });
    document.querySelectorAll('.delete-item').forEach(button => {
      button.addEventListener('click', handleDeleteItem);
    });
    document.querySelectorAll('.btn-checkout').forEach(button => {
      button.addEventListener('click', handleCheckout);
    });

    Object.keys(orderMap).forEach(orderId => {
      updateOrderTotal(orderId);
      });
    })
    .catch(error => console.error('Error fetching orders:', error));
  }

  function handleCheckout(event) {
    const orderElement = event.target.closest('.order-item');
    const orderId = orderElement.getAttribute('data-order-id');

    fetch(`http://localhost:3000/orders/${orderId}/checkout`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('popup-order-id').textContent = orderId;
        document.getElementById('popup-total-price').textContent = data.totalPrice;
        document.getElementById('checkout-popup').style.display = 'block';
        // alert(`Checkout successful!\nOrder ID: ${orderId}\nTotal Price: Rp. ${data.totalPrice}`);
      } else {
        alert('Error during checkout.');
      }
    })
    .catch(error => console.error('Error checking out:', error));
  }

  document.querySelector('.close-popup').addEventListener('click', () => {
    document.getElementById('checkout-popup').style.display = 'none';
  });
  
  document.querySelector('.btn-close-popup').addEventListener('click', () => {
    document.getElementById('checkout-popup').style.display = 'none';
  });
  

  window.addEventListener('click', (event) => {
    const popup = document.getElementById('checkout-popup');
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  });
  

  function handleAddItem(event) {
    const li = event.target.closest('li');
    const orderElement = li.closest('.order-item');
    const orderId = orderElement.getAttribute('data-order-id');
    const menuId = li.getAttribute('data-menu-id');
    const quantityDisplay = li.querySelector('.quantity-display');
    let quantity = parseInt(quantityDisplay.textContent, 10);
    quantity += 1;
    quantityDisplay.textContent = quantity;

    updateOrderItem(orderId, menuId, quantity);
    updateOrderTotal(orderId);
  }

  function handleRemoveItem(event) {
    const li = event.target.closest('li');
    const orderElement = li.closest('.order-item');
    const orderId = orderElement.getAttribute('data-order-id');
    const menuId = li.getAttribute('data-menu-id');
    const quantityDisplay = li.querySelector('.quantity-display');
    let quantity = parseInt(quantityDisplay.textContent, 10);

    if (quantity > 1) {
      quantity -= 1;
      quantityDisplay.textContent = quantity;

      updateOrderItem(orderId, menuId, quantity);
      updateOrderTotal(orderId);
    }
  }

  function handleDeleteItem(event) {
    const li = event.target.closest('li');
    const orderElement = li.closest('.order-item');
    const orderId = orderElement.getAttribute('data-order-id');
    const menuId = li.getAttribute('data-menu-id');
    
    li.remove();
  
    deleteOrderItem(orderId, menuId);
  
    const remainingItems = orderElement.querySelectorAll('li').length;
    
    if (remainingItems === 0) {
      orderElement.remove(); 
  
      const ordersContainer = document.getElementById('ordersContainer');
      if (ordersContainer.querySelectorAll('.order-item').length === 0) {
        ordersContainer.innerHTML = `
          <div class="no-orders">
            <img src="../public/image/empty-cart.jpg" alt="No orders found" class="no-orders-image">
            <p>No orders found.</p>
            <a href="index.html" class="btn-home">Back to Home</a>
          </div>`;
      }
    } else {
      updateOrderTotal(orderId);
    }
  }

  function updateOrderTotal(orderId) {
    const orderElement = document.querySelector(`.order-item[data-order-id="${orderId}"]`);
    const itemElements = orderElement.querySelectorAll('li');
    let total = 0;

    itemElements.forEach(item => {
      const quantity = parseInt(item.querySelector('.quantity-display').textContent, 10);
      const price = parseInt(item.textContent.match(/Rp. (\d+)/)[1], 10);
      total += quantity * price;
    });

    orderElement.querySelector('.order-total').textContent = total;
  }

  function updateOrderItem(orderId, menuId, quantity) {
    fetch(`http://localhost:3000/orders/${orderId}/items/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error updating item: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Item updated successfully:', data);
    })
    .catch(error => console.error('Error updating item:', error));
  }

  function deleteOrderItem(orderId, menuId) {
    fetch(`http://localhost:3000/orders/${orderId}/items/${menuId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error deleting item: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Item deleted successfully:', data);
    })
    .catch(error => console.error('Error deleting item:', error));
  }

});
