const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const BlogRoutes = require('./routes/BlogRoutes');
require('./db'); // Kết nối MongoDB

dotenv.config();

const app = express();

// Cấu hình CORS cho mọi domain (chỉ nên dùng trong dev)
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Xử lý preflight

app.use(express.json()); // Parse JSON body
app.use('/uploads', express.static('uploads')); // Phục vụ file tĩnh

// Routes
app.use('/api/blogs', BlogRoutes); // ✅ đúng tên biến

// Test route
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Server is working' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Internal Server Error');
});

// Khởi động server
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Node Server Started on port ${port}`);
});




/*cách 1:  đổi thành 5001 trong server.js và env: vì tam khai báo 1 host phụ để tránh việc chạy trùng lặp với 1 servẻ khác đang chạy ngầm 
cách 2: lsof -i :5000 kiểm tra ở terminal xem host 5000 có đang chạy ngầm bởi server hay pm nào ko
nếu có thì kill vd: ControlCe 33992 lehuy ... TCP *:commplex-main (LISTEN) ta sẽ dùng kill -9 33992
 */

