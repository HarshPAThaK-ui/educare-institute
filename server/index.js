import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// using middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!')
});



app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';

// using routes 
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", contactRoutes);

// Serve static files from the React app (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
})