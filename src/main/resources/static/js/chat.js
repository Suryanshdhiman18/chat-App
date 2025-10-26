let stompClient = null;
let username = null;

function connect(user) {
  username = user;
  const socket = new SockJS('/ws?user=' + username);
  stompClient = Stomp.over(socket);

  stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);

    // Subscribe to broadcast messages
    stompClient.subscribe('/topic/public', function (message) {
      const parsedMessage = JSON.parse(message.body);
      // Only display if it's not our own message
      if (parsedMessage.sender !== username) {
        showMessage(parsedMessage, false);
      }
    });

    // Subscribe to private messages
    stompClient.subscribe('/user/queue/private', function (message) {
      showMessage(JSON.parse(message.body), false);
    });
  });

  stompClient.subscribe('/topic/onlineUsers', function (message) {
      const users = JSON.parse(message.body);
      updateUserList(users);
  });

}

function updateActiveUsers(users) {
    const contactList = document.getElementById('contactList');

    // Preserve the first static “Active Users” block
    const staticHeader = contactList.querySelector('.contact[data-username="broadcast"]');
    contactList.innerHTML = '';
    contactList.appendChild(staticHeader);

    users.forEach(user => {
        // Skip yourself (so you don’t see your own name in the list)
        if (user === username) return;

        const contact = document.createElement('div');
        contact.classList.add('contact');
        contact.dataset.username = user;

        contact.innerHTML = `
            <div class="contact-name">${user}</div>
        `;

        // Click event — when you click, start private chat
        contact.addEventListener('click', function () {
            document.getElementById('chatMode').value = 'private';
            document.getElementById('privateReceiver').value = user;
            highlightSelectedContact(user);
        });

        contactList.appendChild(contact);
    });
}

// helper to highlight the selected user in UI
function highlightSelectedContact(selectedUser) {
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(c => c.classList.remove('active'));

    const selected = document.querySelector(`.contact[data-username="${selectedUser}"]`);
    if (selected) selected.classList.add('active');
}



// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "/login.html";
});

// Send message
function sendMessage() {
  const input = document.getElementById('messageInput');
  const content = input.value.trim();
  if (!content || !username) return;

  const chatType = document.getElementById('chatType').value;
  const receiver = document.getElementById('receiver').value;

  const message = {
    sender: username,
    content: content,
    timestamp: new Date().toISOString()
  };

  // Show own message immediately
  showMessage(message, true);

  if (chatType === "broadcast") {
    stompClient.send("/app/chat.broadcast", {}, JSON.stringify(message));
  } else if (chatType === "private" && receiver) {
    stompClient.send(`/app/chat.private.${receiver}`, {}, JSON.stringify(message));
  }

  input.value = '';
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

function updateUserList(users) {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user;
        userList.appendChild(li);
    });
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

  connect(username);
});
