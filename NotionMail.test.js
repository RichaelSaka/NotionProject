import { Client } from "@notionhq/client";
import { sendMessage, readAllMessages, deleteMessage, editMessage } from "./index.js";
import jest from "jest-mock";

// Mock the Notion client to prevent actual API calls during tests
jest.mock("@notionhq/client");

// Create a mock implementation of the Notion client methods
const mockNotionClient = {
  pages: {
    create: jest.fn(), // Mock for creating pages
    retrieve: jest.fn(), // Mock for retrieving pages
    update: jest.fn(), // Mock for updating pages
  },
  databases: {
    query: jest.fn(), // Mock for querying databases
  },
};

// Replace the actual Notion Client with the mocked implementation
Client.mockImplementation(() => mockNotionClient);

describe("NotionMail Tests", () => {
  const databaseId = "mockDatabaseId"; // Mock database ID
  process.env.NOTION_PAGE_ID = databaseId; // Set environment variable for tests

  // Reset mock implementations before each test to ensure clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test for sendMessage
   * Ensures that a new message is created in the Notion database with correct properties.
   */
  test("sendMessage should create a page in Notion", async () => {
    // Mock the response from Notion API
    mockNotionClient.pages.create.mockResolvedValue({ id: "mockPageId" });

    await sendMessage("Richael", "Santiago", "Hello, Santiago!");

    // Assert that the correct API call was made
    expect(mockNotionClient.pages.create).toHaveBeenCalledWith({
      parent: { database_id: databaseId },
      properties: {
        Sender: { rich_text: [{ text: { content: "Richael" } }] },
        Recipient: { rich_text: [{ text: { content: "Santiago" } }] },
        Message: { title: [{ text: { content: "Hello, Santiago!" } }] },
        Timestamp: { date: { start: expect.any(String) } }, // Verify a timestamp was sent
      },
    });
  });

  /**
   * Test for readAllMessages
   * Ensures that messages for a specific recipient are fetched and formatted correctly.
   */
  test("readAllMessages should fetch messages for a recipient", async () => {
    // Mock the response from Notion API for a database query
    mockNotionClient.databases.query.mockResolvedValue({
      results: [
        {
          id: "mockPageId1",
          properties: {
            Sender: { rich_text: [{ text: { content: "Richael" } }] },
            Recipient: { rich_text: [{ text: { content: "Santiago" } }] },
            Message: { title: [{ text: { content: "Hello, Santiago!" } }] },
            Timestamp: { date: { start: "2023-01-01T00:00:00Z" } },
          },
        },
      ],
      next_cursor: null, // No additional pages
    });

    const messages = await readAllMessages("Santiago");

    // Assert that the database query was made with the correct filter
    expect(mockNotionClient.databases.query).toHaveBeenCalledWith({
      database_id: databaseId,
      filter: { property: "Recipient", rich_text: { equals: "Santiago" } },
    });

    // Assert that the returned messages are formatted correctly
    expect(messages).toEqual([
      {
        id: "mockPageId1",
        sender: "Richael",
        message: "Hello, Santiago!",
        timestamp: "January 1st, 2023 @ 12:00am",
      },
    ]);
  });

  /**
   * Test for deleteMessage
   * Ensures that a message is archived in Notion when deleted.
   */
  test("deleteMessage should archive a message", async () => {
    // Mock the response from Notion API for updating (archiving) a page
    mockNotionClient.pages.update.mockResolvedValue({});

    // Call the function
    await deleteMessage("mockPageId");

    // Assert that the correct API call was made
    expect(mockNotionClient.pages.update).toHaveBeenCalledWith({
      page_id: "mockPageId",
      archived: true, // Verify the page was archived
    });
  });

  /**
   * Test for editMessage
   * Ensures that a message is retrieved and updated correctly in Notion.
   */
  test("editMessage should update a message in Notion", async () => {
    // Mock the response from Notion API for retrieving the current message
    mockNotionClient.pages.retrieve.mockResolvedValue({
      properties: {
        Message: { title: [{ text: { content: "Old Message" } }] },
      },
    });

    // Mock the response from Notion API for updating the message
    mockNotionClient.pages.update.mockResolvedValue({});

    // Simulate user input for the new message
    const fakeInput = jest.fn().mockResolvedValue("Updated Message");
    const rlMock = { question: fakeInput };

    // Call the function
    await editMessage("mockPageId", rlMock);

    // Assert that the current message was retrieved
    expect(mockNotionClient.pages.retrieve).toHaveBeenCalledWith({
      page_id: "mockPageId",
    });

    // Assert that the updated message was sent to Notion
    expect(mockNotionClient.pages.update).toHaveBeenCalledWith({
      page_id: "mockPageId",
      properties: {
        Message: { title: [{ text: { content: "Updated Message" } }] },
      },
    });
  });
});
