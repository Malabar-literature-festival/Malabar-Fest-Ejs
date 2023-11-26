const AiBot = require("../models/AiBot");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const OpenAI = require("openai");

// Create an instance of OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.aiask = async (req, res) => {
  try {
    let threadId; // Thread ID from the request
    const user = req.user.id;
    const userMessage = req.body.message; // User's message from the request
    const assistantId = "asst_7c0QCY7X9pJwgnr4VfT5hJx9";//req.body ? req.body.assistantId ?? "asst_7c0QCY7X9pJwgnr4VfT5hJx9" : "asst_7c0QCY7X9pJwgnr4VfT5hJx9"; // Your custom assistant ID

    const exists = await AiBot.findOne({ assistantId, user }).exec();
    if (exists) {
      // If it exists, use the existing thread ID
      threadId = exists.threadId;
    } else {
      // If it does not exist, create a new thread and save the new entry
      const myThread = await openai.beta.threads.create();
      threadId = myThread.id; // Ensure to get the ID correctly from the response

      const aiBot = await AiBot.create({ assistantId, user, threadId });
    }
    const mes = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    // Polling mechanism to see if runStatus is completed
    // This should be made more robust.
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Get the last assistant message from the messages array
    const messages = await openai.beta.threads.messages.list(threadId);
    // Find the last message for the current run
    const lastMessageForRun = messages.data.filter((message) => message.run_id === run.id && message.role === "assistant").pop();
    // Send the response back to the front end

    let responseText = lastMessageForRun.content[0].text.value;
    const regex = /\【\d+†source\】/g; // This regex matches the pattern [number†source]
    responseText = responseText.replace(regex, "");
    res.status(200).json({
      answer: responseText,
    });
  } catch (err) {
    console.log(err)
    res.status(200).json({
      answer: 'Something went wrong!',err
    });
  }
};
