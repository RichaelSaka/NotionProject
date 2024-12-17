import dotenv from "dotenv";
import { sendMessage, readAllMessages, editMessage, deleteAllMessages } from "../index";
dotenv.config();


describe("Notion API Tests", () => {
    beforeAll( async () => {
        await deleteAllMessages(false);
    }, 10000);

    test("check the quantity messages sent and read", async () => {
    const quantity = 5;
    for (let i = 0; i < quantity; i++) { 
        await sendMessage("Test Sender", "Test Recipient", `Test Message ${i}`, false); 
    }
    
    const messages = await readAllMessages("Test Recipient", false);
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBe(quantity); 
    });

    test("editMessage should edit the correct message", async () => {
        const message = 'Test Message';
        await sendMessage("Test Sender", "Test Recipient", message, false);

        let messages = await readAllMessages("Test Recipient", false);
        expect(messages[0].message).toBe(message);

        await editMessage(messages[0].id, "Edited Message", false);
        
        messages = await readAllMessages("Test Recipient", false);
        expect(messages[0].message).toBe("Edited Message");
    });


});
