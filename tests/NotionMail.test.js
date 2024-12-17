import dotenv from "dotenv"; 
import { sendMessage, readAllMessages, editMessage, deleteAllMessages } from "../index"; 
dotenv.config(); 


describe("Notion API Tests", () => {
    // Cleanup: Ensure the message store is cleared before each test
    beforeEach(async () => {
        await deleteAllMessages(false); 
    });

    test("check the quantity messages sent and read", async () => {
        const quantity = 5; 
        for (let i = 0; i < quantity; i++) { 
            await sendMessage("Test Sender", "Test Recipient", `Test Message ${i}`, false);
        }

        // Retrieve all messages and validate
        const messages = await readAllMessages("Test Recipient", false);
        expect(Array.isArray(messages)).toBe(true); 
        expect(messages.length).toBe(quantity); // Verify the number of messages matches expected quantity
    });

    test("editMessage should edit the correct message", async () => {
        const message = "Test Message";
        await sendMessage("Test Sender", "Test Recipient", message, false);

        let messages = await readAllMessages("Test Recipient", false);
        expect(messages[0].message).toBe(message); // Verify the original message content

        await editMessage(messages[0].id, "Edited Message", false); // Edit the first message

        messages = await readAllMessages("Test Recipient", false);
        expect(messages[0].message).toBe("Edited Message"); // Verify the edited content
    });

    test("deleteMessage should delete a specific message", async () => {
        const message = "Message to Delete";
        await sendMessage("Test Sender", "Test Recipient", message, false);

        let messages = await readAllMessages("Test Recipient", false);
        expect(messages[0].message).toBe(message); // Confirm message exists

        const messageId = messages[0].id;
        await deleteAllMessages(messageId, false); // Delete specific message by ID

        messages = await readAllMessages("Test Recipient", false);
        expect(messages.length).toBe(0); // Ensure the message was deleted
    });

    test("sendMessage should not send an empty message", async () => {
        const message = "";
        await sendMessage("Test Sender", "Test Recipient", message, false);

        const messages = await readAllMessages("Test Recipient", false);
        expect(messages[0].message).toBe("Empty message"); // Placeholder for empty messages
    });

    test("sendMessage should not send messages with an empty sender or recipient", async () => {
        const message = "Test Message";
        
        // Attempting to send with an empty sender
        await expect(sendMessage("", "Test Recipient", message, false)).rejects.toThrow(
            "Sender and recipient cannot be empty!"
        );

        // Attempting to send with an empty recipient
        await expect(sendMessage("Test Sender", "", message, false)).rejects.toThrow(
            "Sender and recipient cannot be empty!"
        );

        const messages = await readAllMessages("Test Recipient", false);
        expect(messages.length).toBe(0); // Ensure no messages are sent when validation fails
    });
});