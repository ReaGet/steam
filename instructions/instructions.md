# Product Requirements Document (PRD)

---

## Project Overview

We are building an automation tool for [store.steampowered.com](https://store.steampowered.com) that allows programmatic addition of users to friends and gifting specific items to them. The tool listens for webhooks via an API, performs actions (authentication, adding friends, sending gifts), and provides status updates for each step.

### **Key Goals**  
1. Simplify remote friend requests and gifting on Steam.  
2. Enable scalable and secure automation for multiple accounts.  
3. Provide a user-friendly interface to manage accounts, gifts, and logs.

---

## Core Functionalities

### **1. Account Management**  
- **Description:**  
  Manage Steam account credentials (login, password, region) to enable automation.  

- **Features:**  
  1. Add new Steam account credentials.  
  2. View all added accounts in a card-based layout.  
  3. Edit existing credentials.  
  4. Delete accounts no longer needed.  
  5. Authenticate accounts to store session cookies for future use.  

- **UI Requirements:**  
  Each account card should display:  
  - Steam login (masked for security).  
  - Region.  
  - Authentication status (`Authenticated` or `Not Authenticated`).  
  - Buttons for `Edit`, `Delete`, and `Authenticate`.

---

### **2. Gift Management**  
- **Description:**  
  Manage a list of gifts (games or items) that can be sent to friends.

- **Features:**  
  1. Add new gifts with the following details:  
     - `id`: Unique identifier.  
     - `link`: URL to the game/item.  
     - `price`: Cost of the item.  
     - `title`: Name of the game/item.  
  2. View all gifts in a card layout.  
  3. Edit or delete existing gifts.

- **UI Requirements:**  
  Each gift card should display:  
  - Game/item title.  
  - Price.  
  - URL link.  
  - Buttons for `Edit` and `Delete`.

---

### **3. Webhook Integration**  
- **Description:**  
  Listen for webhooks with task instructions and execute the following steps:  
  1. Identify the correct account by region.  
  2. Authenticate to Steam using stored credentials.  
  3. Add the specified user to friends.  
  4. Send the specified gift to the user.  
  5. Log the results of each step.

- **Input Format:**  
  Webhook payload should include:  
  ```json
  {
      "profileLink": "https://store.steampowered.com/user/profile",
      "region": "US",
      "giftId": "12345"
  }
  ```

- **Logs:**  
  Log actions with the following details:  
  - Timestamp.  
  - Account used.  
  - Action performed (Authenticate, Add Friend, Send Gift).  
  - Status (Success or Failure).

---

### **4. Dashboard**  
- **Description:**  
  Unified interface to manage accounts, gifts, and logs.

- **Features:**  
  1. View all accounts in a table or card layout.  
  2. View all gifts.  
  3. Filter logs by account or action.

---

### Technical Details
## File Structure
myapp
├── components
│   ├── AccountCard.tsx        # Reusable component for account management
│   ├── GiftCard.tsx           # Reusable component for gift management
│   ├── Dashboard.tsx          # Main dashboard component
├── pages
│   ├── api
│   │   ├── webhook.ts         # Handles webhook requests
│   │   └── accounts.ts        # CRUD operations for accounts
│   └── index.tsx              # Main dashboard page
├── lib
│   ├── puppeteerUtils.ts      # Puppeteer automation logic
│   └── database.ts            # Interactions with json-server database
├── public
│   └── (static assets)
├── styles
│   └── globals.css            # Tailwind and global CSS styles
├── src
│   ├── models.ts              # TypeScript models for data structures
│   └── utils.ts               # Utility functions
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Documentation

---

### Puppeteer Automation Documentation
## Login Example
```ts
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to Steam login page
    await page.goto('https://store.steampowered.com/login');
    await page.type('#input_username', 'your_username');
    await page.type('#input_password', 'your_password');

    // Handle 2FA
    await page.waitForSelector('#twoFactorCodeEntry');
    await page.type('#twoFactorCodeEntry', 'your_2fa_code');
    await page.click('#login_btn_signin > button');

    // Save session cookies
    const cookies = await page.cookies();
    console.log(cookies);

    await browser.close();
})();
```
## Add Friend Example
```ts
const addFriend = async (cookies, friendSteamId) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Use cookies for authentication
    await page.setCookie(...cookies);
    await page.goto('https://steamcommunity.com/my/friends/add');
    await page.type('#friendInput', friendSteamId);
    await page.click('#addFriendButton');

    await browser.close();
};
```
## Send Gift Example
```ts
const sendGift = async (cookies, giftId) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Use cookies for authentication
    await page.setCookie(...cookies);
    await page.goto(`https://store.steampowered.com/account/manualgiftpurchase/${giftId}`);
    // Add logic to complete gift purchase form...

    await browser.close();
};
```

---

### API Documentation
## Webhook Endpoint
**POST /api/webhook**

**Request:**
```json
{
    "profileLink": "https://store.steampowered.com/user/profile",
    "region": "US",
    "giftId": "12345"
}
```

**Response:**
```json
{
    "status": "Success",
    "message": "Gift sent successfully",
    "logId": "abc12
}
```

## Account Management

**GET /api/accounts**

**Response:**
```json
[
    {
        "id": "1",
        "login": "user1",
        "password": "*****",
        "region": "US",
        "isAuthenticated": true
    }
]
```