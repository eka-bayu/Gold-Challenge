document.addEventListener('DOMContentLoaded', () => {
  
  fetchAndDisplayMenus('Coffee', 'coffeeMenuList');
  fetchAndDisplayMenus('Non-Coffee', 'nonCoffeeMenuList');
  fetchAndDisplayMenus('Food & Snack', 'foodMenuList');
  fetchAndDisplayMenus('Seasonal', 'seasonalMenuList');
  fetchAndDisplayOrders();

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

  function generateOrderId(menuId) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const randomNum = Math.floor(Math.random() * 10000);
    return `${dateStr}-${menuId}-${randomNum}`;
  }

  function orderMenu(menuId, menuName, menuPrice) {
    const orderId = generateOrderId(menuId);

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

      alert(`Order placed successfully!\nOrder ID: ${data.orderId || orderId}\nItem: ${menuName}\nQuantity: 1 \nPrice: ${menuPrice}`);
    })
    .catch(error => console.error('Error placing order:', error));
  }

  function updateCartNotification(count) {
    const cartNotification = document.querySelector('.cart-notification');
    cartNotification.textContent = count;
  }

  const exploreButton = document.querySelector('.btn-explore','.btn-coffee', '.btn-nonCoffe', '.btn-food', '.btn-seasonal');
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

  function fetchAndDisplayOrders() {
    const ordersContainer = document.getElementById('ordersContainer');

    fetch('http://localhost:3000/orders')
    .then(response => response.json())
    .then(orders => {
      ordersContainer.innerHTML = '';
      if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders found.</p>';
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
          <li class = order-list data-menu-id="${item.menuId}">
            ${item.menuName || 'Item name not available'} (x${item.quantity || 'N/A'}) - Rp. ${item.menuPrice || 'Price not available'}
            <div class = button-order>
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
            <p>Total: Rp. <span class="order-total">0</span></p>
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

      // Update total for each order
      Object.keys(orderMap).forEach(orderId => {
        updateOrderTotal(orderId);
      });
    })
    .catch(error => console.error('Error fetching orders:', error));
  }

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
    updateOrderTotal(orderId);
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
