<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- <title>Billing Software - README</title> -->

</head>
<body>

<h1>💻 Billing Software (Spring Boot + React)</h1>
<p align="center">A complete <strong>Point of Sale (POS)</strong> and <strong>Billing System</strong> built with <strong>Spring Boot, React, and MySQL</strong>. It enables you to manage categories, items, and orders with a modern UI, live sales charts, and keyboard navigation.</p>

<div class="section">
<h2>🖼️ Screenshots</h2>
<p>Dashboard</p>
<img src="https://github.com/user-attachments/assets/08ac97d0-bc71-41a7-b032-c958af129f5c" />

<p>Explore</p>
<img src="https://github.com/user-attachments/assets/fe312971-ae5d-4144-8db7-fec4183485a4" />

<p>Manage Items</p>
<img src="https://github.com/user-attachments/assets/6010873b-cf46-4d45-b60a-bb458794b609" />

<p>Manage Categories</p>
<img src="https://github.com/user-attachments/assets/2f6f9f0e-cdab-4f10-b1d7-bbc0db282f85" />

<p>Manage Users</p>
<img src="https://github.com/user-attachments/assets/d04389be-eede-4b93-ab7d-bdc238b08246" />

<p>Order History</p>
<img src="https://github.com/user-attachments/assets/c9553c43-9ec4-44b2-b66c-6a23a96def7b" />

</div>

<div class="section">
<h2>🚀 Features</h2>
<ul>
  <li>🔒 User login & JWT authentication</li>
  <li>🗂️ Manage categories and items</li>
  <li>🔍 Live item search with keyboard navigation (Arrow keys + Enter)</li>
  <li>🛒 Add items to cart and update quantities</li>
  <li>💳 Cash & Card payment system with auto balance calculation</li>
  <li>📊 Real-time dashboard with weekly and daily sales charts</li>
  <li>🧾 Generate and print order receipts</li>
</ul>
</div>

<div class="section">
<h2>🏗️ Project Structure</h2>
<pre>
billing-software/
│
├── billingsoftware/
│   ├── controller/
│   ├── entity/
│   ├── io/
│   ├── repository/
│   ├── service/
│   └── BillingSoftwareApplication.java
│
├── client/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── Service/
│   └── App.jsx
│
└── README.html
</pre>
</div>

<div class="section">
<h2>⚙️ Installation & Setup</h2>
<h3>🧩 Prerequisites</h3>
<ul>
  <li>Java 17+</li>
  <li>Node.js 18+</li>
  <li>MySQL Server</li>
  <li>Maven 3.8+</li>
</ul>

<h3>🖥️ Backend Setup</h3>
<pre>
cd backend

# Update application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/billing_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Run
mvn spring-boot:run
</pre>

<h3>🌐 Frontend Setup</h3>
<pre>
cd frontend
npm install
npm run dev
</pre>
<p>Frontend runs on <strong>http://localhost:5173</strong> and backend on <strong>http://localhost:8080</strong>.</p>
</div>

<div class="section">
<h2>🧠 Keyboard Shortcuts</h2>
<table class="table">
  <tr><th>Action</th><th>Shortcut</th></tr>
  <tr><td>Search item & add to cart</td><td>Enter</td></tr>
  <tr><td>Navigate items</td><td>← / → / ↑ / ↓</td></tr>
  <tr><td>Confirm cash payment</td><td>Enter</td></tr>
  <tr><td>Place order</td><td>Enter</td></tr>
</table>
</div>

<div class="section">
<h2>🧩 Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React (Vite), Bootstrap 5, Recharts, Axios</li>
  <li><strong>Backend:</strong> Spring Boot 3, Hibernate, JPA, Lombok, MySQL</li>
</ul>
</div>

<div class="section">
<h2>🔌 API Endpoints</h2>
<table class="table">
  <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
  <tr><td>POST</td><td>/api/v1.0/auth/login</td><td>Authenticate user</td></tr>
  <tr><td>GET</td><td>/api/v1.0/categories</td><td>Fetch all categories</td></tr>
  <tr><td>GET</td><td>/api/v1.0/items</td><td>Fetch all items</td></tr>
  <tr><td>POST</td><td>/api/v1.0/orders</td><td>Create new order</td></tr>
  <tr><td>GET</td><td>/api/v1.0/dashboard</td><td>Get dashboard statistics</td></tr>
</table>
</div>

<div class="section">
<h2>🧮 Example Order JSON</h2>
<pre>
{
  "customerName": "John Doe",
  "phoneNumber": "0771234567",
  "cartItems": [
    {
      "itemId": "ITM001",
      "name": "Coca-Cola 500ml",
      "price": 120.00,
      "quantity": 2
    }
  ],
  "subtotal": 240.00,
  "tax": 0,
  "grandTotal": 240.00,
  "paymentMethod": "CASH",
  "cashReceived": 300.00,
  "balance": 60.00
}
</pre>
</div>

<div class="section">
<h2>🙌 Author</h2>
<p><strong>👨‍💻 Praneeth Sandaruwan Liyanage</strong><br>
Full Stack Software Engineer<br>
📍 Colombo, Sri Lanka<br>
📧 <a href="mailto:your.email@example.com">praneethsbliyanage@gmail.com</a><br>
💼 <a href="https://github.com/">GitHub</a> | <a href="https://linkedin.com/](https://www.linkedin.com/in/praneeth-liyanage/">LinkedIn</a></p>
</div>

<div class="section">
<h2>🪪 License</h2>
<p>This project is licensed under the <strong>MIT License</strong>. You are free to use, modify, and distribute it with proper attribution.</p>
</div>

<footer>
<p>⭐ If you like this project, give it a star on GitHub!</p>
</footer>

</body>
</html>
