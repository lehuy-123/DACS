const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const blogRoutes = require('./routes/blogRoutes');

// Kết nối MongoDB
require('./db');

// Cấu hình dotenv
dotenv.config();

const app = express();

// Middleware
const corsOptions = {
    origin: '*', // Cho phép mọi domain (chỉ dùng cho development)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  
  // Xử lý preflight request (OPTIONS)
  app.options('*', cors(corsOptions));
app.use(express.json()); // Parse JSON body
app.use('/uploads', express.static('uploads')); // Phục vụ file tĩnh từ thư mục uploads

// Routes
app.use('/api/blogs', blogRoutes); // Định nghĩa prefix cho các route liên quan đến blog
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Internal Server Error');
  });
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Node Server Started on port ${port}`);
});

app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Server is working' });
});