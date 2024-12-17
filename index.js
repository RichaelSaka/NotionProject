import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import readline from "readline";
import { format } from "date-fns";

// Load environment variables from .env file
dotenv.config();

// Initialize Notion client and database ID
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_PAGE_ID;

// CLI setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to send a message
export const sendMessage = async (sender, recipient, message, shouldLog = true) => {
  try {
    const timestamp = new Date().toISOString(); // Generate current timestamp
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Sender: { rich_text: [{ text: { content: sender } }] },
        Recipient: { rich_text: [{ text: { content: recipient } }] },
        Message: { title: [{ text: { content: message } }] },
        Timestamp: { date: { start: timestamp } }, // Save timestamp
      },
    });
    if(shouldLog){
        console.log("\n🎉 ✅ Message sent successfully!");
        console.log(`📬 Message ID: ${response.id}\n`);
    }

  } catch (error) {
    console.error("\n❌ Failed to send message.");
    console.error(`💔 Error: ${error.message}\n`);
  }
};

// Function to read messages for a recipient
export const readAllMessages = async (recipient, shouldLog = true) => {
  try {
    let nextCursor = undefined; // For paginated results
    let allMessages = [];
    if(shouldLog){
      console.log("\n📬 Fetching messages...\n");
    }

    do {
      const queryOptions = {
        database_id: databaseId,
        filter: { property: "Recipient", rich_text: { equals: recipient } },
      };

      if (nextCursor) queryOptions.start_cursor = nextCursor;

      const response = await notion.databases.query(queryOptions);

      response.results.forEach((page) => {
        const id = page.id;
        const sender = page.properties?.Sender?.rich_text?.[0]?.text?.content || "Unknown";
        const message = page.properties?.Message?.title?.[0]?.text?.content || "No message";
        const rawTimestamp = page.properties?.Timestamp?.date?.start || "Unknown";

        const timestamp = rawTimestamp !== "Unknown"
          ? format(new Date(rawTimestamp), "MMMM do, yyyy @ h:mmaaa")
          : rawTimestamp;

        allMessages.push({ id, sender, message, timestamp });

        if(shouldLog){
        console.log(`
📧 Message ID: ${id}
   From: ${sender}
   🕒 Sent At: ${timestamp}
   ✉️ Message: "${message}"
        `);
        }
      });

      nextCursor = response.next_cursor;
    } while (nextCursor);

    if (shouldLog){
      console.log(`✅ Total messages found: ${allMessages.length}\n`);
    }
    return allMessages;
  } catch (error) {
    console.error("\n❌ Failed to fetch messages.");
    console.error(`💔 Error: ${error.message}\n`);
    return [];
  }
};

// Function to delete a message
const deleteMessage = async (messageId) => {
  try {
    await notion.pages.update({ page_id: messageId, archived: true }); // Archive the page
    console.log(`\n🗑️ ✅ Message with ID ${messageId} has been deleted.\n`);
  } catch (error) {
    console.error(`\n❌ Failed to delete message with ID ${messageId}.`);
    console.error(`💔 Error: ${error.message}\n`);
  }
};

// Function to delete all the messages
export const deleteAllMessages = async (shouldLog = true) => {
  try {
    if(shouldLog){
      console.log("\n🗑️ Fetching all messages to delete...\n");
    }

    let nextCursor = undefined; 
    let allPageIds = [];

    do {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: nextCursor,
      });

      const pageIds = response.results.map((page) => page.id);
      allPageIds = allPageIds.concat(pageIds);

      nextCursor = response.next_cursor;
    } while (nextCursor);

    if(shouldLog){
      console.log(`🔍 Found ${allPageIds.length} messages. Proceeding to delete...\n`);
    }
    for (const pageId of allPageIds) {
      await notion.pages.update({
        page_id: pageId,
        archived: true, 
      });
      if(shouldLog){
        console.log(`✅ Deleted message with ID: ${pageId}`); 
      }
    }

    if(shouldLog){ 
      console.log("\n🗑️ ✅ All messages have been deleted successfully!\n"); 
    }
  } catch (error) {
    console.error("\n❌ Failed to delete all messages.");
    console.error(`💔 Error: ${error.message}\n`);
  }
};

// Function to edit a message
export const editMessage = async (messageId, newMessage, shouldLog = true) => {
  try {
    // Retrieve the current message
    const page = await notion.pages.retrieve({ page_id: messageId });
    const currentMessage = page.properties?.Message?.title?.[0]?.text?.content || "No message";
    if(shouldLog){
      console.log(`\n✏️ Current message: "${currentMessage}"`);
    }

    if (newMessage.trim()) {
      await notion.pages.update({
        page_id: messageId,
        properties: { Message: { title: [{ text: { content: newMessage } }] } },
      });
      if(shouldLog){
        console.log(`\n✏️ ✅ Message updated to: "${newMessage}"\n`);
      }
    } else {
      if(shouldLog){
        console.log("\n✏️ No changes were made.\n");
      }
    }
  } catch (error) {
    console.error(`\n❌ Failed to edit message with ID ${messageId}.`);
    console.error(`💔 Error: ${error.message}\n`);
  }
};

// Function to display the main menu
const promptMenu = () => {
  console.log(`
=========================================================
              🌸 Welcome to NotionMail! 🌸
=========================================================
💌 Please select an option:

   📨 send    : Send a new message. ✨
   📬 read    : View your inbox. 📨
   🗑️ delete  : Delete a message. ❌
   ✏️ edit    : Edit a message. 🖋️
   🚪 quit    : Exit the application. 🚶
=========================================================
  `);
};

// Main CLI logic
const main = async () => {
  while (true) {
    promptMenu();

    const option = await new Promise((resolve) => rl.question("👉 Your choice: $ ", resolve));

    if (option === "send") {
      console.log("\n📝 Let's send a new message!\n");
      const sender = await new Promise((resolve) => rl.question("   📝 Sender: $ ", resolve));
      const recipient = await new Promise((resolve) => rl.question("   💌 Recipient: $ ", resolve));
      const message = await new Promise((resolve) => rl.question("   ✍️ Message: $ ", resolve));
      await sendMessage(sender, recipient, message);
    } else if (option === "read") {
      console.log("\n📬 Let's view your inbox!\n");
      const user = await new Promise((resolve) => rl.question("   📛 Your name: $ ", resolve));
      await readAllMessages(user);
    } else if (option === "delete") {
      console.log("\n🗑️ Let's delete a message!\n");
      const messageId = await new Promise((resolve) =>
        rl.question("   🔑 Message ID to delete: $ ", resolve)
      );
      await deleteMessage(messageId);
    } else if (option === "edit") {
      console.log("\n✏️ Let's edit a message!\n");
      const messageId = await new Promise((resolve) =>
        rl.question("   🔑 Message ID to edit: $ ", resolve)
      );
      const newMessage = await new Promise((resolve) =>
        rl.question("   ✍️ New message: $ ", resolve
      ));
      await editMessage(messageId, newMessage);
    } else if (option === "quit") {
      console.log("\n👋 Goodbye! Thanks for using NotionMail! 💖\n");
      rl.close();
      break;
    } else {
      console.log("\n❌ Invalid option! Please try again.\n");
    }
  }
};

// Run the CLI
main();
