document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
  
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        // Ambil nilai dari form
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
  
        // Data yang akan dikirim ke backend
        const formData = {
            name: username,
            email: email,
            password: password,
        };
  
        try {
            // Kirim data ke server menggunakan POST request
            const response = await fetch("http://localhost:3000/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
  
            const result = await response.json();
  
            if (response.ok) {
                // Jika pendaftaran berhasil
                alert("Registration successful! Redirecting to login page...");
                window.location.href = "login.html"; // Redirect ke halaman login
            } else {
                // Jika terjadi kesalahan
                alert("Error: " + result.message);
                console.error("Server Error:", result); // Print server error to console
            }
        } catch (error) {
            console.error("Fetch Error:", error); // Print fetch error to console
            alert("An unexpected error occurred. Please try again later.");
        }
    });
});
