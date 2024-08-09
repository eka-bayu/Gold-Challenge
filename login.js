document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupButton = document.getElementById('signupButton');
    const guestLoginButton = document.getElementById('guestLoginButton');
    const guestPopup = document.getElementById('guestPopup');
    const popupClose = document.getElementById('popupClose');
  
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      // Perform login logic here
      localStorage.setItem('userStatus', 'loggedIn');
      alert('Login successful!');
      window.location.href = 'index.html';
    });
  
    signupButton.addEventListener('click', () => {
      // Redirect to sign up page
      window.location.href = 'signup.html';
    });
  
    guestLoginButton.addEventListener('click', () => {
      // Set user status as guest and redirect to dashboard
      localStorage.setItem('userStatus', 'guest');
      window.location.href = 'index.html';
      showPopup();
    });
  
    popupClose.addEventListener('click', () => {
      hidePopup();
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === guestPopup) {
        hidePopup();
      }
    });
  
    function showPopup() {
      guestPopup.style.display = 'flex';
    }
  
    function hidePopup() {
      guestPopup.style.display = 'none';
    }
  });
  