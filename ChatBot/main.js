const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("");
}

const handleChat = () => {
    userMessage = chatInput.ariaValueMax.trim();
    if(!userMessage) return;

    createChatLi(userMessage, "outgoing");
}

sendChatBtn.addEventListener("click", handleChat);