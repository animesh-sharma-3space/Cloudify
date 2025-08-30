async function login(e) {
    try {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

       
        const res = await fetch("https://cloudify-u8ra.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailid: email, password:password })
        });

        const data = await res.json();

        if (data.success) {

            Swal.fire({
                title: 'Login Successful',
                icon: 'success',
                confirmButtonColor: 'blue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    localStorage.setItem('user_id',data.user.user_id);
                    localStorage.setItem('name',data.user.Name);
                    location.href = '/index.html'; 
                }
            });
        } else {
            Swal.fire({
                title: 'Please Register Yourself',
                icon: 'warning',
                confirmButtonColor: 'blue'
            }).then((result) => {
                if (result.isConfirmed) location.href = 'register.html';
            });
        }
    } catch (err) {
        console.error("Error logging in:", err);
        Swal.fire({
            title: 'Server Error',
            icon: 'error',
            confirmButtonColor: 'blue'
        });
    }
}

// Fetch user profile
async function getProfile() {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login first.");

        const res = await fetch("https://cloudify-u8ra.onrender.com/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // send token
            }
        });

        const data = await res.json();
        
        if (data.success) {
            console.log("Profile data:", data.user);
            localStorage.setItem('user_id',data.id);
           
            document.getElementById("userName").innerText = `Welcome, ${data.user.name}`;
            document.getElementById("userEmail").innerText = `Email: ${data.user.emailid}`;
        } else {
            Swal.fire({
                title: data.message || 'Failed to fetch profile',
                icon: 'error',
                confirmButtonColor: 'blue'
            });
        }
    } catch (err) {
        console.error("Profile fetch error:", err);
        Swal.fire({
            title: 'Profile fetch error',
            icon: 'error',
            confirmButtonColor: 'blue'
        });
    }
}

// Register function remains the same
async function register(e) {
    try {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        const res = await fetch("https://cloudify-u8ra.onrender.com/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, emailid: email, password:password })
        });

        const data = await res.json();

        if (data.flag) {
            Swal.fire({
                title: 'Register Successful',
                icon: 'success',
                confirmButtonColor: 'blue'
            }).then((result) => {

                if (result.isConfirmed) location.href = 'login.html';
            });
        } else {
            Swal.fire({
                title: data.message || 'Server Error',
                icon: 'error',
                confirmButtonColor: 'blue'
            });
        }
    } catch (err) {
        console.error("Network or server error:", err);
        Swal.fire({
            title: 'Network or server error',
            icon: 'error',
            confirmButtonColor: 'blue'
        });
    }
}
