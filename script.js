const desktop = document.getElementById('desktop');
const taskbar = document.getElementById('taskbar');
const desktopIcons = document.getElementById('desktop-icons');
const contextMenu = document.getElementById('context-menu');
const fakeEmails = [
  {
    sender: 'John Doe',
    subject: 'Meeting Reminder',
    body: 'Don\'t forget our meeting tomorrow at 10 AM.',
  },
  {
    sender: 'Jane Smith',
    subject: 'Project Update',
    body: 'Here\'s the latest update on the project.',
  },
  {
    sender: 'Support',
    subject: 'Your Account',
    body: 'Please verify your account information.',
  },
  // Add more fake emails as needed
];
const sentEmails = [
  {
    recipient: 'Alice Johnson',
    subject: 'Re: Project Details',
    body: 'Here are the updated project details.',
  },
  {
    recipient: 'Bob Williams',
    subject: 'Meeting Follow-up',
    body: 'Thanks for the meeting. Here are the action items.',
  },
  // ... (more sent emails)
];

window.addEventListener('load', () => {
    initializeChatbot();
});

function createEmailContent() {
  return `
    <div id="email-tabs">
      <button id="inbox-tab" class="active-tab">Inbox</button>
      <button id="sent-tab">Sent</button>
    </div>
    <div id="email-list">
      ${createEmailList(fakeEmails, 'inbox')}
    </div>
    <div id="email-view"></div>
  `;
}

function createEmailList(emails, listType) {
    let emailList = '<ul>';
    emails.forEach((email, index) => {
        let subject = listType === 'inbox'? email.subject: `To: ${email.recipient}, ${email.subject}`;
        let sender = listType === 'inbox'? email.sender: "Me";

        // Corrected line:
        emailList += `<li data-email-index="${index}" data-list-type="${listType}">${subject} - ${sender}</li>`;
    });
    emailList += '</ul>';
    return emailList;
}

function displayEmail(email) { //Expect the email object
  const emailView = document.getElementById('email-view');
  if (emailView) {
    let sender = email.sender || "Me";
    let recipient = email.recipient || "Unknown";

    emailView.innerHTML = `
      <h3>${email.subject}</h3>
      <p>From: ${sender}</p>
      <p>To: ${recipient}</p>
      <p>${email.body}</p>
    `;

    // Adjust window height:
    const windowContent = emailView.parentElement; // Get the .window-content element
    const windowElement = windowContent.parentElement; //Get the window element.
    const titleBarHeight = windowElement.querySelector(".window-titlebar").offsetHeight; //get titlebar height.
    const padding = 200; //Add some extra height.
    windowElement.style.height = (emailView.offsetHeight + titleBarHeight + padding) + "px"; //set window height.
  }
}

function setupEmailListeners(windowElement) {
  const inboxTab = windowElement.querySelector('#inbox-tab');
  const sentTab = windowElement.querySelector('#sent-tab');
  const emailList = windowElement.querySelector('#email-list');

  inboxTab.addEventListener('click', () => {
    inboxTab.classList.add('active-tab');
    sentTab.classList.remove('active-tab');
    emailList.innerHTML = createEmailList(fakeEmails, 'inbox');
    document.getElementById("email-view").innerHTML = ""; //clear email view
  });

  sentTab.addEventListener('click', () => {
    sentTab.classList.add('active-tab');
    inboxTab.classList.remove('active-tab');
    emailList.innerHTML = createEmailList(sentEmails, 'sent');
    document.getElementById("email-view").innerHTML = ""; //clear email view
  });

  windowElement.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (listItem) {
      const emailIndex = parseInt(listItem.dataset.emailIndex); //Parse the index
      const listType = listItem.dataset.listType;
      const email = listType === 'inbox' ? fakeEmails[emailIndex] : sentEmails[emailIndex];
      displayEmail(email); //Pass the email object
    }
  });
}


function createWindow(appName, content) {
    console.log("Creating window:", appName);
    const window = document.createElement('div');
    window.classList.add('window');

    // Add positioning (example):
    const existingWindows = document.querySelectorAll('.window');
    let top = 50, left = 50;
    if (existingWindows.length > 0) {
        const lastWindow = existingWindows[existingWindows.length - 1];
        top = parseInt(lastWindow.style.top) + 20;
        left = parseInt(lastWindow.style.left) + 20;
    }
    window.style.top = top + 'px';
    window.style.left = left + 'px';

    window.innerHTML = `
        <div class="window-titlebar">${appName}</div>
        <div class="window-content">${content}</div>
    `;
    desktop.appendChild(window);
    makeDraggable(window);
    console.log("Window created:", window);
    return window;
}

function makeDraggable(element) {
    const titlebar = element.querySelector('.window-titlebar');
    let offsetX, offsetY, isDragging = false;

    titlebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.zIndex = getHighestZindex() + 1; //bring window to front.
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        element.style.left = e.clientX - offsetX + 'px';
        element.style.top = e.clientY - offsetY + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
function getHighestZindex(){
    let highestZ = 0;
    document.querySelectorAll(".window").forEach(window =>{
        const currentZ = parseInt(window.style.zIndex) || 0;
        if(currentZ > highestZ){
            highestZ = currentZ;
        }
    });
    return highestZ;
}

taskbar.addEventListener('click', (event) => {
    if (event.target.classList.contains('taskbar-icon')) {
        const app = event.target.dataset.app;
        if (app === 'terminal') {
            createWindow('Terminal', '<p>Command Line</p>');
        } else if (app === 'notepad') {
            createWindow('Notepad', '<textarea></textarea>');
        } else if (app === 'email') {
            const emailWindow = createWindow('Email', createEmailContent());
            setupEmailListeners(emailWindow);
        } else if (app === "chatbot"){
            const chatWindow = createWindow("Chatbot", createChatbotContent());
            setupChatbotListeners(chatWindow);
        }
    }
});

desktopIcons.addEventListener('dblclick', (event) => {
    if (event.target.classList.contains('desktop-icon')) {
        const app = event.target.dataset.app;
        if (app === 'my-document') {
            createWindow('My Document', '<p>This is my document.</p>');
        } else if (app === 'email') {
            const emailWindow = createWindow('Email', createEmailContent());
            setupEmailListeners(emailWindow);
        } else if (app === "chatbot"){
            const chatWindow = createWindow("Chatbot", createChatbotContent());
            setupChatbotListeners(chatWindow);
        }
    }
});

desktop.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.display = 'block';
});

document.addEventListener('click', (event) => {
    if (!contextMenu.contains(event.target)) {
        contextMenu.style.display = 'none';
    }
});

document.getElementById("context-refresh").addEventListener("click", ()=>{
    console.log("refresh");
    contextMenu.style.display = 'none';
});

function createChatbotContent() {
    return `
        <div id="chat-log"></div>
        <input type="text" id="chat-input" name="chat-input" placeholder="Type your message...">
        <button id="chat-send">Send</button>
    `;
}

let chatbot;

function initializeChatbot() {
    console.log("Initializing chatbot...");
    chatbot = new RiveScript();
    chatbot.loadFile("brain.rive").then(() => {
        console.log("RiveScript brain loaded successfully.");
        chatbot.sortReplies();
    }).catch(error => {
        console.error("Error loading RiveScript brain:", error);
    });
}

function setupChatbotListeners(windowElement) {
    const chatLog = windowElement.querySelector("#chat-log");
    const chatInput = windowElement.querySelector("#chat-input");
    const chatSend = windowElement.querySelector("#chat-send");

    chatSend.addEventListener("click", () => {
        sendMessage();
    });

    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value;
        if (message) {
            chatLog.innerHTML += `<p>You: ${message}</p>`;
            chatInput.value = "";

            chatbot.reply("local-user", message).then(reply => {
                chatLog.innerHTML += `<p>Chatbot: ${reply}</p>`;
                chatLog.scrollTop = chatLog.scrollHeight; // Scroll to bottom
            });
        }
    }
}
