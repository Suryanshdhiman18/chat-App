let stompClient = null;
let username = null;
let onlineUsers = new Set();

let typingTimeout = null;
let isTyping = false;
let currentChatUser = null;

// stores message DOM elements for tick updates
let messageStore = {}; // messageId → element


/* ---------------------------------------------------
   CONNECT TO WEBSOCKET
--------------------------------------------------- */
function connect(user) {
    username = user;

    const socket = new SockJS("/ws?user=" + username);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {
        console.log("CONNECTED as", username);

        /* ----------- BROADCAST MESSAGES ----------- */
        stompClient.subscribe("/topic/public", function (msg) {
            const m = JSON.parse(msg.body);
            if (m.sender !== username) showMessage(m, false);
        });

        /* ----------- PRIVATE MESSAGES ----------- */
        stompClient.subscribe("/user/queue/private", function (msg) {
            const m = JSON.parse(msg.body);
            showMessage(m, false);

            // After receiving → send SEEN status
            sendStatus(m.messageId, m.sender, "SEEN");
        });

        /* ----------- TYPING INDICATION ----------- */
        stompClient.subscribe("/topic/typing", msg => handleTyping(JSON.parse(msg.body)));
        stompClient.subscribe("/user/queue/typing", msg => handleTyping(JSON.parse(msg.body)));

        /* ----------- MESSAGE STATUS (TICKS) ----------- */
        stompClient.subscribe("/user/queue/status", function (msg) {
            const status = JSON.parse(msg.body);
            updateMessageTicks(status);
        });

        /* ----------- ONLINE USERS ----------- */
        stompClient.subscribe("/topic/onlineUsers", function (msg) {
            onlineUsers = new Set(JSON.parse(msg.body));
            updateUserListUI();
        });
    });
}


/* ---------------------------------------------------
   LOAD ALL USERS
--------------------------------------------------- */
async function loadAllUsers() {
    const res = await fetch("/api/users/all");
    window.allUsers = await res.json();
    updateUserListUI();
}


/* ---------------------------------------------------
   UPDATE CONTACT LIST
--------------------------------------------------- */
function updateUserListUI() {
    const list = document.getElementById("contactList");
    if (!list || !window.allUsers) return;

    const header = list.querySelector('.contact[data-username="broadcast"]');
    list.innerHTML = "";
    if (header) list.appendChild(header);

    window.allUsers.forEach(user => {
        if (user === username) return;

        const isOnline = onlineUsers.has(user) ? "🟢" : "⚪";

        const div = document.createElement("div");
        div.classList.add("contact");
        div.dataset.username = user;
        div.innerHTML = `<div class='contact-name'>${isOnline} ${user}</div>`;

        div.addEventListener("click", () => {
            currentChatUser = user;
            document.getElementById("receiver").value = user;
            document.getElementById("chatType").value = "private";

            document.querySelectorAll(".contact").forEach(c => c.classList.remove("active"));
            div.classList.add("active");

            document.getElementById("chatWith").innerText = user;
        });

        list.appendChild(div);
    });
}


/* ---------------------------------------------------
   SEND MESSAGE
--------------------------------------------------- */
function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (!text) return;

    const chatType = document.getElementById("chatType").value;
    const receiver = document.getElementById("receiver").value;

    const messageId = crypto.randomUUID(); // unique id

    const msg = {
        messageId: messageId,
        sender: username,
        content: text,
        timestamp: new Date().toISOString()
    };

    const el = showMessage(msg, true);
    messageStore[messageId] = el;

    if (chatType === "broadcast") {
        stompClient.send("/app/chat.broadcast", {}, JSON.stringify(msg));
    } else {
        stompClient.send(`/app/chat.private.${receiver}`, {}, JSON.stringify(msg));
    }

    input.value = "";
    sendTyping(false);
}


/* ---------------------------------------------------
   SHOW MESSAGE IN UI
--------------------------------------------------- */
function showMessage(msg, isOwn) {
    const area = document.getElementById("messageArea");
    const row = document.createElement("div");

    row.classList.add("chat-message", isOwn ? "own" : "other");

    row.innerHTML = `
        <div>
            <strong>${msg.sender}</strong>: ${msg.content}
            <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            ${isOwn ? `<span class="ticks" id="tick-${msg.messageId}">✓</span>` : ""}
        </div>
    `;

    area.appendChild(row);
    area.scrollTop = area.scrollHeight;

    return row;
}


/* ---------------------------------------------------
   UPDATE MESSAGE TICKS
--------------------------------------------------- */
function updateMessageTicks(status) {
    const tick = document.getElementById("tick-" + status.messageId);
    if (!tick) return;

    if (status.status === "DELIVERED") tick.innerHTML = "✓✓";
    if (status.status === "SEEN") {
        tick.innerHTML = "✓✓";
        tick.classList.add("seen");
    }
}


/* ---------------------------------------------------
   SEND STATUS PACKAGE
--------------------------------------------------- */
function sendStatus(messageId, sender, status) {
    const dto = {
        messageId: messageId,
        sender: sender,
        receiver: username,
        status: status
    };
    stompClient.send(`/app/chat.status.${sender}`, {}, JSON.stringify(dto));
}


/* ---------------------------------------------------
   TYPING INDICATOR
--------------------------------------------------- */
function handleTyping(data) {
    const label = document.getElementById("typingStatus");

    if (data.type === "broadcast") {
        if (data.sender !== username && data.typing)
            label.innerText = `${data.sender} is typing...`;
        else label.innerText = "";
    }

    if (data.type === "private") {
        if (data.sender === currentChatUser && data.typing)
            label.innerText = `${data.sender} is typing...`;
        else label.innerText = "";
    }
}


/* ---------------------------------------------------
   SEND TYPING EVENT
--------------------------------------------------- */
function sendTyping(flag) {
    const chatType = document.getElementById("chatType").value;
    const receiver = document.getElementById("receiver").value;

    const dto = {
        sender: username,
        type: chatType,
        receiver: receiver,
        typing: flag
    };

    stompClient.send("/app/typing", {}, JSON.stringify(dto));
}


/* ---------------------------------------------------
   INPUT TYPING DETECTION
--------------------------------------------------- */
document.getElementById("messageInput").addEventListener("input", () => {
    if (!isTyping) {
        isTyping = true;
        sendTyping(true);
    }

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        isTyping = false;
        sendTyping(false);
    }, 1500);
});


/* ---------------------------------------------------
   ENTER SEND
--------------------------------------------------- */
document.getElementById("messageInput").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});


/* ---------------------------------------------------
   LOGOUT
--------------------------------------------------- */
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
});


/* ---------------------------------------------------
   PAGE LOAD
--------------------------------------------------- */
window.addEventListener("load", async () => {
    username = localStorage.getItem("username") || sessionStorage.getItem("username");

    if (!username) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("loggedInUsername").innerText = "Logged as: " + username;

    connect(username);
    await loadAllUsers();
});
