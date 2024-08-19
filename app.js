import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PostRoute from './routes/post.route.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/messages.router.js';

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;

const app = express();

// CORS setup
/*app.use(cors({
  origin: BASE_URL,
  credentials: true,
}));*/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  
   });
app.use("/api/posts", PostRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use('/api/chats', chatRouter);
app.use('/api/message', messageRouter);

// Catch-all route for testing
app.use('/*', (req, res) => {
  res.json({ message: 'working' });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
