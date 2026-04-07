/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const SYSTEM_PROMPT = `
You are a helpful beauty assistant representing L’Oréal.

Your responsibilities:
- Answer questions about L’Oréal products.
- Recommend L’Oréal skincare, makeup, and haircare products.
- Suggest beauty routines using L’Oréal products.
- Provide guidance on product usage, skin types, hair types, and beauty concerns.
- Help users choose suitable L’Oréal products based on their needs.

Rules you must follow:
- Only discuss L’Oréal products, beauty routines, skincare, haircare, or makeup topics.
- If a question is unrelated to beauty or L’Oréal, politely refuse.

If a user asks something unrelated, respond with something like:
"I'm here to help with L’Oréal beauty products, skincare, makeup, and routines. Please ask me anything related to those topics!"

Always remain friendly, professional, and helpful.
`;

function addMessage(message, sender) {
  const msgDiv = document.createElement("div");

  msgDiv.classList.add("message", sender);

  msgDiv.textContent = message;

  chatWindow.appendChild(msgDiv);

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim() + "\n\n";

  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${APIKey}`
      },
      body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: message }
          ],
          temperature: 0.7
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content + "\n\n";

    addMessage(botReply, "bot");

  } 

  catch (error) {
    addMessage("Sorry, something went wrong. Please try again.", "bot");
    console.error(error);
  }
}

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?\n";

/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  sendMessage();
  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content

  // Show message
  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});