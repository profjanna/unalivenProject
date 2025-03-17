const desktop = document.getElementById('desktop');
const taskbar = document.getElementById('taskbar');
const desktopIcons = document.getElementById('desktop-icons');
const contextMenu = document.getElementById('context-menu');
const openWindows = {};

//THis initializes the Chatbot
window.addEventListener('load', () => {
    initializeChatbot();
});

// Trash STUFF
let trashBin = [
    {
        name: "Confidential Report.txt",
        content: "This report contains sensitive information...",
        deletionDate: new Date(2023, 10, 15),
    },
    {
        name: "Personal Diary.doc",
        content: "Entry 1: Today was a strange day...",
        deletionDate: new Date(2023, 10, 18),
    },
];

// Get the trash icon element
const trashIcon = document.getElementById('trash-icon'); // Replace 'trash-icon' with the actual ID

// Example: When the trash icon is clicked
if (trashIcon) { // Check if the element exists
    trashIcon.addEventListener('dblclick', () => {
        const trashWindow = createWindow("Trash", createTrashContent());
        setupTrashListeners(trashWindow);
    });
} else {
    console.error("Trash icon element not found.");
}

//Trash
function createTrashContent() {
    let trashHtml = '<ul>';
    trashBin.forEach(file => {
        trashHtml += `<li data-file-name="${file.name}">${file.name}</li>`;
    });
    trashHtml += '</ul>';
    return trashHtml;
}

//Trash
function setupTrashListeners(windowElement) {
    const trashList = windowElement.querySelector('ul');

    trashList.addEventListener('click', (event) => {
        const listItem = event.target.closest('li');
        if (listItem) {
            const fileName = listItem.dataset.fileName;
            const file = trashBin.find(f => f.name === fileName);

            if (file) {
                alert(file.content);
                trashBin = trashBin.filter(f => f.name !== fileName);
                listItem.remove();
            }
        }
    });
}

//Email STUFF 
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



//Window Stuff
function createWindow(appName, content) {
    if (openWindows[appName]) {
        console.log(`Window "${appName}" is already open.`);
        return; // Don't create a new window
    }

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
        <div class="resize-handle top-left"></div>
        <div class="resize-handle top-right"></div>
        <div class="resize-handle bottom-left"></div>
        <div class="resize-handle bottom-right"></div>
        <div class="resize-handle top"></div>
        <div class="resize-handle bottom"></div>
        <div class="resize-handle left"></div>
        <div class="resize-handle right"></div>
    `;

    desktop.appendChild(window); // Append the window to the desktop

    makeDraggable(window);
    makeResizable(window); // Make the window resizable

    console.log("Window created:", window);
    openWindows[appName] = true; // Mark window as open

    // Add close button functionality
    const titleBar = window.querySelector(".window-titlebar");
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.cssFloat = "right";
    closeButton.addEventListener("click", () => {
        window.remove();
        openWindows[appName] = false; // Mark window as closed.
    });
    titleBar.appendChild(closeButton);

    return window;
}
// resizeable 
function makeResizable(element) {
    const resizeHandles = element.querySelectorAll('.resize-handle');
    const desktop = document.getElementById('desktop');

    resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            let isResizing = true;
            let startX = e.clientX;
            let startY = e.clientY;
            let startWidth = element.offsetWidth;
            let startHeight = element.offsetHeight;

            const handleClass = handle.classList;

            function resize(e) {
                if (!isResizing) return;

                let deltaX = e.clientX - startX;
                let deltaY = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = element.offsetLeft;
                let newTop = element.offsetTop;

                if (handleClass.contains('top-left')) {
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight - deltaY;
                    newLeft = element.offsetLeft + deltaX;
                    newTop = element.offsetTop + deltaY;
                } else if (handleClass.contains('top-right')) {
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight - deltaY;
                    newTop = element.offsetTop + deltaY;
                } else if (handleClass.contains('bottom-left')) {
                    newWidth = startWidth - deltaX;
                    newHeight = startHeight + deltaY;
                    newLeft = element.offsetLeft + deltaX;
                } else if (handleClass.contains('bottom-right')) {
                    newWidth = startWidth + deltaX;
                    newHeight = startHeight + deltaY;
                } else if (handleClass.contains("top")) {
                    newHeight = startHeight - deltaY;
                    newTop = element.offsetTop + deltaY;
                } else if (handleClass.contains("bottom")) {
                    newHeight = startHeight + deltaY;
                } else if (handleClass.contains("left")) {
                    newWidth = startWidth - deltaX;
                    newLeft = element.offsetLeft + deltaX;
                } else if (handleClass.contains("right")) {
                    newWidth = startWidth + deltaX;
                }

                // Bounds checking:
                const desktopRect = desktop.getBoundingClientRect();
                const windowRect = {
                    left: newLeft,
                    top: newTop,
                    width: newWidth,
                    height: newHeight,
                    right: newLeft + newWidth,
                    bottom: newTop + newHeight
                };

                if (windowRect.left < desktopRect.left) {
                    newLeft = desktopRect.left;
                    newWidth = windowRect.width;
                }
                if (windowRect.top < desktopRect.top) {
                    newTop = desktopRect.top;
                    newHeight = windowRect.height;
                }
                if (windowRect.right > desktopRect.right) {
                    newWidth = desktopRect.right - newLeft;
                }
                if (windowRect.bottom > desktopRect.bottom) {
                    newHeight = desktopRect.bottom - newTop;
                }

                // Minimum size checking.
                const minWidth = 150;
                const minHeight = 100;

                if (newWidth < minWidth) {
                    newWidth = minWidth;
                }
                if (newHeight < minHeight) {
                    newHeight = minHeight;
                }

                element.style.width = newWidth + 'px';
                element.style.height = newHeight + 'px';
                element.style.left = newLeft + 'px';
                element.style.top = newTop + 'px';
            }

            document.addEventListener('mousemove', resize);

            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.removeEventListener('mousemove', resize);
            });
            e.preventDefault();
        });
    });
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




//TaskBar STuff
taskbar.addEventListener('click', (event) => {
    const icon = event.target.closest('.taskbar-icon'); // Find the closest ancestor with the class 'taskbar-icon'

    if (icon) { // Check if an icon was found
        const app = icon.dataset.app; // Get the data-app attribute from the icon

        if (app === 'terminal') {
            createWindow('Terminal', '<p>Command Line</p>');
        } else if (app === 'notepad') {
            createWindow('Notepad', '<textarea></textarea>');
        } else if (app === 'email') {
            const emailWindow = createWindow('Email', createEmailContent());
            setupEmailListeners(emailWindow);
        } else if (app === "chatbot") {
            const chatWindow = createWindow("Chatbot", createChatbotContent());
            setupChatbotListeners(chatWindow);
        } else if (app === "browser") {
            const browserWindow = createWindow("Browser", createBrowserContent("https://maggie-nye.github.io/unaliven/", ["https://profjanna.github.io/CompanyWebSite/", "https://maggie-nye.github.io/unaliven/"]));
            setupBrowserListeners(browserWindow);
        }
    }
});



//DesktopSTuff

desktopIcons.addEventListener('dblclick', (event) => {
    const icon = event.target.closest('.desktop-icon'); // Find the closest ancestor with the class 'desktop-icon'

    if (icon) { // Check if an icon was clicked
        const app = icon.dataset.app; // Get the data-app attribute from the icon element
        console.log("data-app value:", app); // Log the data-app value
        
if (app === 'my-document') {
            fetch('firstChatLog.html') // Fetch the external HTML
                .then(response => response.text())
                .then(html => {
                    createWindow('My Document', html); // Pass the HTML content to createWindow
                })
                .catch(error => {
                    console.error('Error loading document:', error);
                    createWindow('My Document', '<p>Error loading document.</p>'); // Handle errors
                });
        } else if (app === 'email') {
            console.log("Creating My email window..."); // Log before creating the window
            const emailWindow = createWindow('Email', createEmailContent());
            setupEmailListeners(emailWindow);
        } else if (app === "chatbot") {
            console.log("Creating My chat window..."); // Log before creating the window
            const chatWindow = createWindow("Chatbot", createChatbotContent());
            setupChatbotListeners(chatWindow);
        } else if (app === "browser") {
            console.log("Creating browser window..."); // Log before creating the window
            const browserWindow = createWindow("Browser", createBrowserContent("https://maggie-nye.github.io/unaliven/", ["https://profjanna.github.io/CompanyWebSite/"]));
            setupBrowserListeners(browserWindow);
        } else if (app === "trashCan") {
            console.log("Creating trash window..."); // Log before creating the window
            const trashWindow = createWindow("Trash", createTrashContent());
            setupTrashListeners(trashWindow);
        }
    }
});

function createBrowserContent(initialUrl, tabUrls) {
    let tabsHtml = '';
    tabUrls.forEach((url, index) => {
        tabsHtml += `<button class="browser-tab" data-url="${url}" data-tab-index="${index}">${url}</button>`;
    });

    return `
        <div class="browser-tab-bar">
            ${tabsHtml}
        </div>
        <div class="browser-content">
            <iframe src="${initialUrl}" class="browser-iframe"></iframe>
        </div>
    `;
}



//Browser STuff
function setupBrowserListeners(windowElement) {
    const tabs = windowElement.querySelectorAll('.browser-tab');
    const iframe = windowElement.querySelector('.browser-iframe');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            iframe.src = tab.dataset.url;

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active-tab'));

            // Add active class to the clicked tab
            tab.classList.add('active-tab');
        });
    });

    //set the first tab to active on window creation.
    if(tabs.length > 0){
        tabs[0].classList.add("active-tab");
    }
}





//ChatBotContent
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
    chatbot = new RiveScript({ utf8: true }); // 
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

    function createMessageElement(text, sender) {
        const messageElement = document.createElement("p");
        messageElement.textContent = `${sender}: ${text}`;
        return messageElement;
    }

    function sendMessage() {
        const message = chatInput.value;
        if (message) {
            chatLog.appendChild(createMessageElement(message, "You"));
            chatInput.value = "";

            chatbot.reply("local-user", message).then(reply => {
                chatLog.appendChild(createMessageElement(reply, "Chatbot"));
                // Delay scroll to ensure rendering
                setTimeout(() => {
                    chatLog.scrollTop = chatLog.scrollHeight;
                }, 10);
            });
        }
    }
}

