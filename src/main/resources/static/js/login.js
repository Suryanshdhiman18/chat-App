//document.addEventListener("DOMContentLoaded", () => {
//  const loginBtn = document.getElementById("loginBtn");
//  const signupBtn = document.getElementById("signupBtn");
//
//  // If already logged in, go directly to chat
//  if (localStorage.getItem("username")) {
//    window.location.href = "/index.html";
//    return;
//  }
//
//  loginBtn.addEventListener("click", async () => {
//    const username = document.getElementById("username").value.trim();
//    const password = document.getElementById("password").value.trim();
//
//    if (!username || !password) {
//      alert("Enter username and password");
//      return;
//    }
//
//    const res = await fetch("/api/auth/login", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify({ username, password })
//    });
//
//    if (res.ok) {
////      localStorage.setItem("username", username);
//      sessionStorage.setItem("username", username);
//      window.location.href = "/index.html";
//    } else {
//      alert("Invalid login credentials");
//    }
//  });
//
//document.getElementById("signupBtn").addEventListener("click", function() {
//    window.location.href = "signup.html";
//});
//
//});


document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const passwordField = document.getElementById("password");

  // If already logged in, go directly to chat
  if (localStorage.getItem("username")) {
    window.location.href = "/index.html";
    return;
  }

  // ⭐ Pressing Enter inside password triggers login button
  passwordField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();   // prevents form submission reloads
      loginBtn.click();     // triggers login
    }
  });

  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      sessionStorage.setItem("username", username);
      window.location.href = "/index.html";
    } else {
      alert("Invalid login credentials");
    }
  });

  signupBtn.addEventListener("click", () => {
    window.location.href = "signup.html";
  });
});

