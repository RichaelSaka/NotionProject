# NotionMail 

NotionMail is a simple **Command-Line Interface (CLI)** application for managing messages using **Notion as a backend database**. You can send, read, edit, and delete messages seamlessly through this lightweight program while integrating with Notion's API.

---

## ✨ Features

- **Send Messages**: Easily send a new message with a sender, recipient, and content.
- **Read Inbox**: Retrieve and view messages sent to a specific recipient.
- **Edit Messages**: Modify the content of an existing message by its ID.
- **Delete Messages**: Remove a message from your database.
- **Clean Inbox**: Delete all messages from your Notion database at once.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Notion account and API access.

### Step 1: Clone the Repository
```bash
git clone <repository-link>
cd notion-project
```

### Step 2: Install Dependencies
Install required dependencies using `npm`:
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the project root directory and add the following credentials:
```env
NOTION_API_KEY=your_notion_api_key
NOTION_PAGE_ID=your_notion_database_id
```

### Step 4: Configure Your Notion Database
Set up your Notion table with these columns:
1. **Message**: Title property (renamed to "Message").
2. **Sender**: Text property.
3. **Recipient**: Text property.
4. **Timestamp**: Date property.

### Step 5: Run the Program
Launch the CLI:
```bash
npm start
```

---

## 📚 Commands Overview

| Command     | Description                          |
|-------------|--------------------------------------|
| `send`      | Send a new message.                 |
| `read`      | View your inbox messages.           |
| `edit`      | Edit an existing message.           |
| `delete`    | Delete a message by its ID.         |
| `quit`      | Exit the NotionMail CLI.            |

---

## 🛠️ Technical Design Choices

1. **Notion API Integration**:  
   The Notion API is used for database interactions, making it a robust backend solution. Notion's page properties store message details like sender, recipient, and timestamp.

2. **CLI Interface**:  
   The `readline` module simplifies user input, providing a smooth and interactive terminal experience.

3. **Error Handling**:  
   Clear error messages are implemented when issues like invalid IDs, missing credentials, or empty inputs arise.

4. **Date Formatting**:  
   The **`date-fns`** library ensures consistent and readable date-time formatting.

---

## 🛠️ Dependencies
- **[@notionhq/client](https://www.npmjs.com/package/@notionhq/client)**: Official Notion API client.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Manages environment variables.
- **[date-fns](https://www.npmjs.com/package/date-fns)**: Formats timestamps.
- **[ESLint](https://eslint.org/)**: Ensures clean code formatting.
- **Jest**: For testing.

---

## 🧩 References
- **[Notion API Documentation](https://developers.notion.com/)**: Used for database queries and updates.
- **[StackOverflow](https://stackoverflow.com/)**: Solutions for handling CLI and async programming.
- **Node.js Documentation**: For `readline` and error handling.

---

## 🚀 Future Improvements
1. **Search Functionality**: Implement filters to search messages by keywords or senders.
2. **Pagination**: Improve reading large inboxes with paginated results.
3. **Bulk Operations**: Add support for bulk message deletion or updates.
4. **GUI Integration**: Create a web-based frontend to complement the CLI version.
5. **Notifications**: Add email or app notifications for new messages.

---

## 🤔 Known Issues
- Due to time constraints The application currently lacks advanced input validation for special characters.
- Users must ensure the Notion database is correctly configured before running the app.
- The `punycode` module warning may appear; this is deprecated in Node.js and can be ignored.

---

Here's an updated version of the **Technical Design Choices** section for your `README.md`, highlighting the technical decisions you made:

---

## 🛠️ Technical Design Choices


1. **Modular Code Structure**  
   Functions for sending, reading, editing, and deleting messages are implemented as separate modules. This modular approach improves code readability and allows each function to be individually testable and reusable.

2. **Error Handling**  
   Comprehensive error handling ensures smooth execution and graceful failures. Errors like missing fields, invalid Notion API keys, or empty inputs provide clear and user-friendly messages to guide users in resolving issues.

3. **Environment Variables for Security**  
   The **`dotenv`** package is used to manage sensitive credentials like the Notion API key and database ID. Storing these values in a `.env` file improves security by avoiding hardcoding secrets directly into the code.

4. **Date Formatting with `date-fns`**  
   The **`date-fns`** library is used for consistent and human-readable timestamp formatting. This decision makes the output more user-friendly, ensuring dates are displayed in formats like `December 17th, 2024 @ 1:53 AM`.

5. **ESLint for Code Quality**  
   **ESLint** is integrated into the project to enforce coding standards and maintain clean, consistent code. This helps in identifying and fixing potential issues during development.

6. **Testing with Jest**  
   Unit tests are implemented using **Jest**, ensuring the core functions (e.g., sending, reading, and deleting messages) work as expected. This choice ensures reliability and makes the codebase easier to maintain.

---

Let me know if you'd like me to expand further or refine any details!

## 🧪 Testing
Run tests using:
```bash
npm test
```

---

## 👩‍💻 Author
**Richael Saka**  
A lightweight tool to simplify Notion message management from the terminal.

---

### 🌸 Thank you for using NotionMail! 🌸

---