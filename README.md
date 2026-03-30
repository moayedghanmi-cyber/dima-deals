# 🛍️ DimaDeals – Digital Products Store

A full-stack web app for selling digital accounts (Netflix, Spotify, etc.) with a complete admin dashboard. Orders, products, messages, and admin credentials are all stored in a **SQLite database**.

---

## 📁 Project Structure

```
dimadeals/
├── server.js          # Express server (entry point)
├── db.js              # SQLite database + schema + seeding
├── package.json
├── dimadeals.db       # Auto-created SQLite database file
├── middleware/
│   └── auth.js        # Admin session authentication
├── routes/
│   ├── auth.js        # POST /api/auth/login|logout|me|change-password
│   ├── products.js    # GET|POST|PUT|DELETE /api/products
│   ├── orders.js      # GET|POST|PATCH|DELETE /api/orders
│   ├── messages.js    # GET|POST|PATCH|DELETE /api/messages
│   └── settings.js    # GET|PUT /api/settings
└── public/
    ├── index.html     # Full frontend SPA
    └── uploads/       # Payment receipts stored here
```

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
cd dimadeals
npm install
```

### 2. Start the server
```bash
npm start
# Server runs at http://localhost:3000
```

### 3. Access the store
- **Storefront**: http://localhost:3000
- **Admin panel**: http://localhost:3000/#admin-panel

---

## 🔐 Default Admin Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin2026`|

> ⚠️ **Change these immediately** from the Security section in the admin dashboard!

---

## 📦 Features

### Storefront
- Product catalog with category filters
- Shopping cart with quantity support
- Full checkout with:
  - Customer info (name, email, WhatsApp)
  - Delivery method (Email or WhatsApp)
  - 5 Tunisian payment methods: Flouci, D17, Poste Tunisienne, Virement Bancaire, Wafacash
  - Payment receipt upload (JPG, PNG, PDF — up to 10MB)
- Contact form

### Admin Dashboard (`/#admin-panel`)
- **Overview**: Live stats (orders, revenue, pending, messages)
- **Orders**: Full order table with approve/reject/delete + delivery notes field
- **Products**: Add/edit/delete/hide products
- **Messages**: Read/delete contact messages with unread indicator
- **Settings**: Update all payment account numbers and contact info
- **Security**: Change admin password (bcrypt hashed)

---

## 🗄️ Database Tables

| Table      | Description                        |
|------------|------------------------------------|
| `admins`   | Admin users with hashed passwords  |
| `products` | Digital products catalog           |
| `orders`   | Customer orders + receipt filenames|
| `messages` | Contact form submissions           |
| `settings` | Payment numbers, support contacts  |

---

## 🌐 Deploying

### Option A – VPS (Ubuntu)
```bash
npm install -g pm2
pm2 start server.js --name dimadeals
pm2 save
# Set up nginx as reverse proxy to port 3000
```

### Option B – Railway / Render
- Push to GitHub
- Connect repo to Railway or Render
- Set `PORT` environment variable if needed

### Option C – Local network (for testing)
```bash
# Find your local IP
ip addr show   # Linux
ipconfig       # Windows

# Access from phone on same WiFi:
http://192.168.x.x:3000
```

---

## 🔧 Environment Variables (optional)

Create a `.env` file:
```
PORT=3000
```

---

## 📝 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get active products |
| POST | `/api/orders` | Place order (multipart/form-data) |
| POST | `/api/messages` | Submit contact form |
| GET | `/api/settings` | Get payment/contact info |

### Admin (requires `x-admin-token` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current admin |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/products/all` | All products incl. hidden |
| POST | `/api/products` | Add product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | Get orders (filterable) |
| GET | `/api/orders/stats` | Dashboard stats |
| PATCH | `/api/orders/:id/status` | Update order status |
| PATCH | `/api/orders/:id/notes` | Add delivery notes |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/messages` | Get messages |
| PATCH | `/api/messages/:id/read` | Mark as read |
| DELETE | `/api/messages/:id` | Delete message |
| PUT | `/api/settings` | Update settings |
