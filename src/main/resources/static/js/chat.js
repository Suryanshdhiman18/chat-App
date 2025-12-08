let stompClient = null;
let username = null;
let onlineUsers = new Set();
let typingTimeout = null;   // timeout handle
let currentChatUser = null; // whom you are chatting with (private)
let isTyping = false;

/* ===========================================================
   CONNECT TO SOCKET
=========================================================== */
function connect(user) {
    username = user;
    const socket = new SockJS('/ws?user=' + username);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {
        console.log("Connected as", username);

        /* ---------------- Broadcast messages ---------------- */
        stompClient.subscribe('/topic/public', function (message) {
            const msg = JSON.parse(message.body);
            if (msg.sender !== username) showMessage(msg, false);
        });

        /* ---------------- Private messages ---------------- */
        stompClient.subscribe('/user/queue/private', function (message) {
            showMessage(JSON.parse(message.body), false);
        });

        /* ---------------- TYPING INDICATOR ---------------- */
        stompClient.subscribe('/topic/typing', function (msg) {
            handleTyping(JSON.parse(msg.body));
        });

        stompClient.subscribe('/user/queue/typing', function (msg) {
            handleTyping(JSON.parse(msg.body));
        });

        /* ---------------- Online users list ---------------- */
        stompClient.subscribe('/topic/onlineUsers', function (message) {
            const users = JSON.parse(message.body);
            console.log("ONLINE USERS:", users);
            onlineUsers = new Set(users);
            updateUserListUI();
        });
    });
}

/* ===========================================================
   LOAD USERS FROM DATABASE
=========================================================== */
async function loadAllUsers() {
    try {
        const response = await fetch("/api/users/all");
        const users = await response.json();

        window.allUsers = users;
        updateUserListUI();

    } catch (error) {
        console.error("Failed to load users list", error);
    }
}

/* ===========================================================
   UPDATE CONTACT LIST UI
=========================================================== */
function updateUserListUI() {
    const contactList = document.getElementById("contactList");
    if (!contactList || !window.allUsers) return;

    const header = contactList.querySelector('.contact[data-username="broadcast"]');
    contactList.innerHTML = "";
    if (header) contactList.appendChild(header);

    window.allUsers.forEach(user => {
        if (user === username) return;

        const contact = document.createElement("div");
        contact.classList.add("contact");
        contact.dataset.username = user;

        const isOnline = onlineUsers.has(user) ? "🟢" : "⚪";

        contact.innerHTML = `<div class="contact-name">${isOnline} ${user}</div>`;

        contact.addEventListener("click", () => {
            currentChatUser = user;
            document.getElementById("chatType").value = "private";
            document.getElementById("receiver").value = user;

            document.querySelectorAll("#contactList .contact")
                .forEach(c => c.classList.remove("active"));
            contact.classList.add("active");

            document.getElementById("chatWith").textContent = `${user}`;
        });

        contactList.appendChild(contact);
    });
}

/* ===========================================================
   SEND MESSAGE
=========================================================== */
function sendMessage() {
    const input = document.getElementById("messageInput");
    const content = input.value.trim();
    if (!content || !username) return;

    const chatType = document.getElementById("chatType").value;
    const receiver = document.getElementById("receiver").value;

    const message = {
        sender: username,
        content: content,
        timestamp: new Date().toISOString()
    };

    showMessage(message, true);

    if (chatType === "broadcast") {
        stompClient.send("/app/chat.broadcast", {}, JSON.stringify(message));
    } else if (chatType === "private" && receiver) {
        stompClient.send(`/app/chat.private.${receiver}`, {}, JSON.stringify(message));
    }

    input.value = "";
    sendTyping(false); // stop typing
}

/* ===========================================================
   SHOW MESSAGE IN UI
=========================================================== */
function showMessage(message, isOwn = false) {
    const area = document.getElementById("messageArea");
    const el = document.createElement("div");

    el.classList.add("chat-message");
    el.classList.add(isOwn ? "own" : "other");

    el.innerHTML = `
        <strong>${message.sender}</strong>: ${message.content}
        <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
    `;

    area.appendChild(el);
    area.scrollTop = area.scrollHeight;
}

/* ===========================================================
   TYPING INDICATOR HANDLER
=========================================================== */
function handleTyping(data) {
    const typingLabel = document.getElementById("typingStatus");

    // Check correct context (broadcast or correct receiver)
    if (data.type === "broadcast") {
        if (data.sender !== username && data.typing) {
            typingLabel.innerText = `${data.sender} is typing...`;
        } else typingLabel.innerText = "";
    }

    if (data.type === "private") {
        if (data.sender === currentChatUser && data.typing) {
            typingLabel.innerText = `${data.sender} is typing...`;
        } else typingLabel.innerText = "";
    }
}

/* ===========================================================
   SEND TYPING EVENT
=========================================================== */
function sendTyping(isTyping) {
    if (!stompClient) return;

    const chatType = document.getElementById("chatType").value;
    const receiver = document.getElementById("receiver").value;

    const typingDTO = {
        sender: username,
        type: chatType,
        receiver: receiver,
        typing: isTyping
    };

    if (chatType === "broadcast") {
        stompClient.send("/app/typing.broadcast", {}, JSON.stringify(typingDTO));
    } else if (chatType === "private") {
        stompClient.send(`/app/typing.private.${receiver}`, {}, JSON.stringify(typingDTO));
    }
}

/* ===========================================================
   TRIGGER TYPING ON KEY PRESS
=========================================================== */
document.getElementById("messageInput").addEventListener("input", () => {
    if (!isTyping) {
        isTyping = true;
        sendTyping(true);
    }

    clearTimeout(typingTimeout);

    // stop typing after 1.5 sec of inactivity
    typingTimeout = setTimeout(() => {
        isTyping = false;
        sendTyping(false);
    }, 1500);
});

/* ===========================================================
   ENTER TO SEND
=========================================================== */
document.getElementById("messageInput").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

/* ===========================================================
   LOGOUT
=========================================================== */
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("username");
    sessionStorage.removeItem("username");
    window.location.href = "/login.html";
});

/* ===========================================================
   ON PAGE LOAD
=========================================================== */
window.addEventListener("load", async () => {
    username = sessionStorage.getItem("username") || localStorage.getItem("username");

    if (!username) {
        window.location.href = "/login.html";
        return;
    }

    document.getElementById("loggedInUsername").textContent = "Logged in as: " + username;

    connect(username);
    await loadAllUsers();
});

