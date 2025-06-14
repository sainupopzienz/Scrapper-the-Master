if (true) {
  console.log = function () {};
  console.error = function () {};
  console.warn = function () {};
  console.info = function () {};
  console.debug = function () {};
}

// form details
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("chatbot_token");

  const formContainer = document.querySelector(".ChatForm");
  const chatHeader = document.querySelector("#chatbot-header");
  const formBtnContainer = document.getElementById("chatSendBtn");
  const messageContainer = document.getElementById("chatbot-message-container");
  const uiHandle = document.getElementById("ui-handle");

  if (token) {
    formContainer.classList.add("d-none");
    messageContainer.classList.remove("d-none");
    formBtnContainer.classList.remove("d-none");
    chatHeader.classList.add("d-none");
    uiHandle.classList.remove("d-none");
  } else {
    formContainer.classList.remove("d-none");
    messageContainer.classList.add("d-none");
    chatHeader.classList.remove("d-none");
  }
});

const patterns = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone_number: /^[6-9]\d{9}$/,
};

const messages = {
  name: "Please enter a valid name (letters and spaces only, 2–50 characters).",
  email: "Please enter a valid email address.",
  phone_number: "Enter a valid 10-digit mobile number starting with 6–9.",
};
function validateField(fieldId) {
  const input = document.getElementById(fieldId);
  const value = input.value.trim();
  const errorElem = document.getElementById(`${fieldId}-error`);

  if (!patterns[fieldId].test(value)) {
    errorElem.textContent = messages[fieldId];
    return false;
  } else {
    errorElem.textContent = "";
    return true;
  }
}

document.getElementById("name").addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-Z\s]/g, "");
  validateField("name");
});

document.getElementById("phone_number").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
  validateField("phone_number");
});

["email"].forEach((fieldId) => {
  const input = document.getElementById(fieldId);
  input.addEventListener("input", () => validateField(fieldId));
  input.addEventListener("change", () => validateField(fieldId));
});
// form details close

//waiting page button click
document
  .getElementById("waiting-formsend")
  .addEventListener("click", function () {
    document.getElementById("waiting-page").classList.add("d-none");
    document.getElementById("chatbot-message-container").classList.remove("d-none");
    document.getElementById("chatSendBtn").classList.remove("d-none");
    document.getElementById("ui-handle").classList.remove("d-none");
  });

// clear chat js
document
  .getElementById("chatbot-formsend")
  .addEventListener("click", async function () {
    const isNameValid = validateField("name");
    const isEmailValid = validateField("email");
    const isMobileValid = validateField("phone_number");
    // const successMessage = document.getElementById("success-message");
    const nameValue = document.getElementById("name").value.trim();
    const emailValue = document.getElementById("email").value.trim();
    const mobileValue = document.getElementById("phone_number").value.trim();

    if (isNameValid && isEmailValid && isMobileValid) {
      // successMessage.textContent = "Form submitted successfully!";
      // Reset form (optional)
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone_number").value = "";
      try {
        const response = await fetch(
          "https://api-uat.pixl.ai/chatbot-pixl/api/v1/register_pixl",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: nameValue,
              email: emailValue,
              phone_number: mobileValue,
            }),
          }
        );

        const data = await response.json();

        if (data.status === "success" && data.detail.token) {
          // Store token
          localStorage.setItem("chatbot_token", data.detail.token);

          // Hide form
          document.querySelector(".ChatForm").classList.add("d-none");
          document.querySelector("#chatbot-header").classList.add("d-none");

          // Show chat message area
          document.querySelector("#waiting-page").classList.remove("d-none");
          // document
          //   .getElementById("chatbot-messages")
          //   .classList.remove("d-none");
          // document.getElementById("chatSendBtn").classList.remove("d-none");
        } else {
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Something went wrong. Please try again later.");
      }
    } else {
      // successMessage.textContent = "";
    }
  });

document.getElementById("clear-chat").addEventListener("click", clearChatHistory);

function clearChatHistory() {
  const token = localStorage.getItem("chatbot_token");
  if (!token) {
    showAlert("User not authenticated.", "warning");
    return;
  }
  const requestBody = {
    uid: "",
    token: token,
    message: "",
    chatbot_type: "pixl_agent",
    voice_input_file: "string",
    language: "en",
    uploaded_input_file: "string",
    uploaded_input_type: "string",
    clear_conversation_history: true,
  };

  fetch("https://api-uat.pixl.ai/chatbot-pixl/api/v1/chat", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      const code = data.detail?.code;
      if (code === 200) {
        document.getElementById("chatbot-messages").innerHTML = "";
        showAlert("Conversation history cleared!", "success");
      } else {
        showAlert("Failed to clear conversation.", "warning");
      }
    })
    .catch((err) => {
      console.error("Clear chat error:", err);
      showAlert("Something went wrong while clearing the chat.", "warning");
    });
}

// chatBot js
document.addEventListener("DOMContentLoaded", function () {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeChatbotButton = document.getElementById("close-chatbot");
  const sendButton = document.getElementById("chatbot-send");
  const inputField = document.getElementById("chatbot-input");
  const messagesContainer = document.getElementById("chatbot-messages");
  const resizeHandle = document.querySelector(".resize-handle");

  let isChatbotOpen = false;

  if (chatbotIcon) {
    chatbotIcon.addEventListener("click", () => {
      isChatbotOpen ? closeChatbot() : openChatbot();
      isChatbotOpen = !isChatbotOpen;
    });
  }

  if (closeChatbotButton) {
    closeChatbotButton.addEventListener("click", closeChatbot);
  }

  if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
  }

  if (inputField) {
    inputField.addEventListener("keydown", handleInputFieldKeydown);
  }

  if (resizeHandle) {
    let isResizing = false,
      startX,
      startY,
      startWidth,
      startHeight,
      startTop,
      startLeft;

    resizeHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = chatbotContainer.offsetWidth;
      startHeight = chatbotContainer.offsetHeight;
      startTop = chatbotContainer.offsetTop;
      startLeft = chatbotContainer.offsetLeft;

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    });

    function resize(e) {
      if (!isResizing) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newWidth = startWidth - dx;
      let newHeight = startHeight - dy;
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      // Clamp size
      newWidth = Math.max(300, Math.min(600, newWidth));
      newHeight = Math.max(300, Math.min(600, newHeight));

      // Only adjust position if size changed (prevents unwanted jumps)
      if (newWidth !== chatbotContainer.offsetWidth) {
        chatbotContainer.style.width = `${newWidth}px`;
        chatbotContainer.style.left = `${
          startLeft + (startWidth - newWidth)
        }px`;
      }

      if (newHeight !== chatbotContainer.offsetHeight) {
        chatbotContainer.style.height = `${newHeight}px`;
        chatbotContainer.style.top = `${
          startTop + (startHeight - newHeight)
        }px`;
      }
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }
  }

  // Functions
  function openChatbot() {
    chatbotContainer.classList.remove("d-none");

    const chatbotIcon = document.getElementById("chatbot-icon");
    chatbotIcon.innerHTML = `<img src="../assets/svgs/close.svg" alt="Close" width="24" height="24" />`;
  }

  function closeChatbot() {
    chatbotContainer.classList.add("d-none");

    const chatbotIcon = document.getElementById("chatbot-icon");
    chatbotIcon.innerHTML = `<img src="../assets/svgs/lucide.svg" alt="Bot" width="24" height="24" />`;
  }

  function sendMessage() {
    const userMessage = inputField.value.trim();
    if (userMessage === "") return;

    sendButton.disabled = true;
    inputField.disabled = true;
    const wrapper = document.createElement("div");
    wrapper.className = "user-message-container";

    const messageEl = document.createElement("div");
    messageEl.className = "user-message";
    messageEl.textContent = userMessage;

    const avatarContainer = document.createElement("div");
    avatarContainer.className = "user-avatar-container";
    const avatar = document.createElement("img");
    avatar.src = "../assets/svgs/user.svg";
    avatar.alt = "User";
    avatar.className = "user-avatar";
    avatarContainer.appendChild(avatar);

    wrapper.appendChild(messageEl);
    wrapper.appendChild(avatarContainer);
    messagesContainer.appendChild(wrapper);
    inputField.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    messagesContainer.innerHTML += `<div class="typing-loader"></div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    sendToApi(userMessage);
  }

  function handleInputFieldKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  // message send api call
  function sendToApi(userMessage) {
    const apiUrl = "https://api-uat.pixl.ai/chatbot-pixl/api/v1/chat";
    let token = localStorage.getItem("chatbot_token");

    const requestBody = {
      uid: "",
      token: token,
      message: userMessage,
      chatbot_type: "pixl_agent",
      voice_input_file: "string",
      language: "en",
      uploaded_input_file: "string",
      uploaded_input_type: "string",
      clear_conversation_history: false,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then(async (data) => {
        const code = data.detail?.code;

        if (code === 401) {
          // Token expired — try refreshing
          const newToken = await refreshToken();
          if (newToken) {
            requestBody.token = newToken;

            return fetch(apiUrl, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            })
              .then((retryResponse) => retryResponse.json())
              .then((retryData) => {
                renderChatResponse(retryData);
              });
          } else {
            throw new Error("Token refresh failed.");
          }
        } else if (code === 403) {
          localStorage.removeItem("chatbot_token");
          // You must define these in your DOM
          const chatHeader = document.querySelector("#chatbot-header");
          const formContainer = document.querySelector(".ChatForm");
          const messagesContainer = document.getElementById(
            "chatbot-message-container"
          );
          const formChatBtnContainer = document.getElementById("chatSendBtn");
          chatHeader.classList.remove("d-none");
          formContainer.classList.remove("d-none");
          formChatBtnContainer.classList.add("d-none");
          messagesContainer.classList.add("d-none");
          messagesContainer.innerHTML = "";
          document.getElementById("chatbot-input").disabled = false;
          document.getElementById("chatbot-send").disabled = false;
          alert("Authentication failed. Please try again.");
        } else if (code === 429) {
          localStorage.removeItem("chatbot_token");
          // You must define these in your DOM
          const chatHeader = document.querySelector("#chatbot-header");
          const formContainer = document.querySelector(".ChatForm");
          const messagesContainer = document.getElementById(
            "chatbot-message-container"
          );
          const formChatBtnContainer = document.getElementById("chatSendBtn");
          chatHeader.classList.remove("d-none");
          formContainer.classList.remove("d-none");
          formChatBtnContainer.classList.add("d-none");
          messagesContainer.classList.add("d-none");
          messagesContainer.innerHTML = "";
          document.getElementById("chatbot-input").disabled = false;
          document.getElementById("chatbot-send").disabled = false;
          showAlert("You have exceeded the rate limit", "warning");
        } else {
          renderChatResponse(data);
        }
      })
      .catch((error) => {
        const typingLoader = document.querySelector(".typing-loader");
        if (typingLoader) typingLoader.remove();
        console.error("Error:", error);
        const wrapper = document.createElement("div");
        wrapper.className = "ai-message-container";
        const avatarContainer = document.createElement("div");
        avatarContainer.className = "ai-avatar-container";
        const avatar = document.createElement("img");
        avatar.src = "../assets/svgs/lucide.svg";
        avatar.alt = "Bot";
        avatar.className = "ai-avatar";
        avatarContainer.appendChild(avatar);
        const messageEl = document.createElement("div");
        messageEl.className = "ai-message";
        messageEl.innerHTML = "Sorry, something went wrong.";
        wrapper.appendChild(avatarContainer);
        wrapper.appendChild(messageEl);
        messagesContainer.appendChild(wrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        sendButton.disabled = false;
        inputField.disabled = false;
        inputField.focus();
      });
  }

  // chat render
  function renderChatResponse(data) {
    const typingLoader = document.querySelector(".typing-loader");
    if (typingLoader) typingLoader.remove();

    const aiResponse = data.detail.message?.response || "No response from API";

    const wrapper = document.createElement("div");
    wrapper.className = "ai-message-container";

    const avatarContainer = document.createElement("div");
    avatarContainer.className = "ai-avatar-container";
    const avatar = document.createElement("img");
    avatar.src = "../assets/svgs/lucide.svg";
    avatar.alt = "Bot";
    avatar.className = "ai-avatar";
    avatarContainer.appendChild(avatar);

    const messageEl = document.createElement("div");
    messageEl.className = "ai-message";
    messageEl.innerHTML = ""; // prepare for streaming

    wrapper.appendChild(avatarContainer);
    wrapper.appendChild(messageEl);
    messagesContainer.appendChild(wrapper);
    wrapper.scrollIntoView({ behavior: "smooth", block: "end" });

    streamMarkdown(aiResponse, messageEl);

    sendButton.disabled = false;
    inputField.disabled = false;
    inputField.focus();
  }

  async function streamMarkdown(markdownText, container, delay = 10) {
    const parsedMarkdown = markdownText.replace(/\\n/g, "\n");
    const html = marked.parse(parsedMarkdown);
    container.innerHTML = ""; // Clear previous content

    // Stream as HTML content instead of plain text
    for (let i = 0; i < html.length; i++) {
      container.innerHTML = html.slice(0, i + 1);
      container.scrollIntoView({ behavior: "smooth", block: "end" });
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  // refresh token API call
  async function refreshToken() {
    const currentToken = localStorage.getItem("chatbot_token");
    const requestBody = {
      refresh_token: currentToken,
      detail: {
        additionalProp1: {},
      },
    };
    try {
      const response = await fetch(
        "https://api-uat.pixl.ai/chatbot-pixl/api/v1/new_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.detail.token) {
        localStorage.setItem("chatbot_token", data.detail.token);
        return data.detail.token;
      } else {
        console.warn("Token refresh failed.");
        return null;
      }
    } catch (err) {
      console.error("Refresh token error:", err);
      return null;
    }
  }

  function formatResponse(response) {
    const cleaned = response
      .replace(/\*\*/g, "") // Remove all **
      .replace(/\n\n/g, "</p><p>") // Double newlines to new paragraphs
      .replace(/\n/g, "<br>"); // Single newline to <br>
    return `<p class="responseMsg">${cleaned}</p>`;
  }
});

// Custom Alert
function showAlert(message, type, time = 3000) {
  const alertContainer = document.getElementById("alert-container");
  const alertHTML = `
    <div class="alert align-items-center br_5 d-flex justify-content-between p-2 shadow_sm3 ${type}">
      <span class="fw_500">${message}</span>
      <button class="btn p-0 px-2 close-btn font_18 cursor-pointer ml-3">&times;</button>
    </div>
  `;
  alertContainer.innerHTML = alertHTML;

  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    alertContainer.innerHTML = "";
  });

  setTimeout(() => {
    alertContainer.innerHTML = "";
  }, time);
}
