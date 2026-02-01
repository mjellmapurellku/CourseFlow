const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = fileUploadWrapper.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// API setup
const API_URL = "https://localhost:55554/api/chat";

// user message and file data
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};

// chat history
const chatHistory = [];

/* ================== ✅ ADDITION (ONLY CHANGE) ================== */
/* Inject system rules ONCE so AI recommends correctly */
chatHistory.push({
  role: "system",
  content: `
You are a course recommendation assistant for CourseFlow.

Rules:
- Recommend courses based on the user's completed courses.
- DO NOT recommend courses the user is already enrolled in or has completed.
- Suggest logical next-level or related courses.
- Keep responses concise and helpful.
`
});
/* =============================================================== */

const initialInputHeight = messageInput.scrollHeight;

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// ================== BOT RESPONSE ==================
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  if (!userData.message || !userData.message.trim()) {
    incomingMessageDiv.classList.remove("thinking");
    messageElement.innerText = "⚠️ Empty message";
    return;
  }

  chatHistory.push({
    role: "user",
    content: userData.message.trim(),
  });

  userData.message = null;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        messages: chatHistory,
      }),
    });

    const rawText = await response.text();
    if (!response.ok) throw new Error(rawText);

    const parsed = JSON.parse(rawText);

    const apiResponseText =
      parsed.choices?.[0]?.message?.content ||
      parsed.message?.content ||
      parsed.content ||
      "No response";

    messageElement.innerText = apiResponseText;

    chatHistory.push({
      role: "assistant",
      content: apiResponseText,
    });
  } catch (err) {
    console.error(err);
    messageElement.innerText = "Backend error — check console";
  }

  incomingMessageDiv.classList.remove("thinking");
};

// ================== SEND MESSAGE ==================
const handleOutgoingMessage = (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  userData.message = text;
  messageInput.value = "";
  messageInput.dispatchEvent(new Event("input"));
  fileUploadWrapper.classList.remove("file-uploaded");

  const messageContent = `
    <div class="message-text"></div>
    ${
      userData.file.data
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
        : ""
    }
  `;

  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );
  outgoingMessageDiv.querySelector(".message-text").innerText = text;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const thinkingContent = `
      <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9z"/>
      </svg>
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    `;

    const incomingMessageDiv = createMessageElement(
      thinkingContent,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    generateBotResponse(incomingMessageDiv);
  }, 600);
};

// ================== INPUT HANDLING ==================
messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
    handleOutgoingMessage(e);
  }
});

// ================== FILE UPLOAD ==================
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileInput.value = "";
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");

    userData.file = {
      data: e.target.result.split(",")[1],
      mime_type: file.type,
    };
  };
  reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

// ================== UI ==================
sendMessage.addEventListener("click", handleOutgoingMessage);
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
