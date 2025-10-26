let stompClient = null;
let username = null;

function connect() {
  const socket = new SockJS('/ws');
  stompClient = Stomp.over(socket);

  stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);

    stompClient.subscribe('/topic/public', function (message) {
      showMessage(JSON.parse(message.body));
    });

    stompClient.subscribe('/user/queue/private', function (message) {
      showMessage(JSON.parse(message.body));
    });
  });
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "/login.html";
});

// Send message
function sendMessage() {
  const content = document.getElementById('messageInput').value.trim();
  if (!content) return;

  const chatType = document.getElementById('chatType').value;
  const receiver = document.getElementById('receiver').value;

  const message = {
    sender: username,
    content: content,
    timestamp: new Date()
  };

  if (chatType === "broadcast") {
    stompClient.send("/app/chat.broadcast", {}, JSON.stringify(message));
    showMessage(message, true);
  } else if (chatType === "private" && receiver) {
    stompClient.send(`/app/chat.private.${receiver}`, {}, JSON.stringify(message));
    showMessage(message, true);
  }

  document.getElementById('messageInput').value = '';
}

// Display messages
function showMessage(message, isOwn = false) {
  const messageArea = document.getElementById('messageArea');
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.classList.add(isOwn ? 'own' : 'other');

  messageElement.innerHTML = `
    <strong>${message.sender}</strong>: ${message.content}
    <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
  `;

  messageArea.appendChild(messageElement);
  messageArea.scrollTop = messageArea.scrollHeight;
}

// Send message on Enter
document.getElementById("messageInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

window.addEventListener('load', () => {
  username = localStorage.getItem("username");

  if (!username) {
    alert("Please login first!");
    window.location.href = "login.html";
  } else {
    document.getElementById("loggedInUsername").textContent = `Logged in as: ${username}`;
  }

  connect();
});



//let stompClient = null;
//let username = null;
//
//function connect() {
//    const socket = new SockJS('/ws');
//    stompClient = Stomp.over(socket);
//
//    stompClient.connect({}, function (frame) {
//        console.log('Connected: ' + frame);
//
//        // Subscribe to broadcast messages
//        stompClient.subscribe('/topic/public', function (message) {
//            showMessage(JSON.parse(message.body));
//        });
//
//        // Subscribe to private messages for this user
//        stompClient.subscribe('/user/queue/private', function (message) {
//            showMessage(JSON.parse(message.body));
//        });
//    });
//}
//
//// Logout handler
//document.getElementById("logoutBtn").addEventListener("click", () => {
//    localStorage.removeItem("username"); // remove stored username
//    window.location.href = "/login.html"; // redirect to login page
//});
//
//
//function sendMessage() {
//    const content = document.getElementById('messageInput').value;
//    const chatType = document.getElementById('chatType').value;
//    const receiver = document.getElementById('receiver').value;
//
//    const message = {
//        sender: username,
//        content: content,
//        timestamp: new Date()
//    };
//
//    if (chatType === "broadcast") {
//        stompClient.send("/app/chat.broadcast", {}, JSON.stringify(message));
//    } else if (chatType === "private" && receiver) {
//        stompClient.send(`/app/chat.private.${receiver}`, {}, JSON.stringify(message));
//    }
//
//    document.getElementById('messageInput').value = '';
//}
//
//function showMessage(message) {
//    const messageArea = document.getElementById('messageArea');
//    const messageElement = document.createElement('div');
//    messageElement.classList.add('chat-message');
//
//    messageElement.innerHTML = `
//        <strong>${message.sender}</strong>: ${message.content}
//        <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
//    `;
//
//    messageArea.appendChild(messageElement);
//    messageArea.scrollTop = messageArea.scrollHeight;
//}
//
//window.addEventListener('load', () => {
//  username = localStorage.getItem("username");
//
//  if (!username) {
//      alert("Please login first!");
//      window.location.href = "login.html";
//  }
//
//    connect();
//});
