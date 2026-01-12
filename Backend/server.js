import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB is connected");
}).catch((err) => {
  console.log("There is error", err);
}) 

app.use("/bot/v1", chatbotRoutes);

app.get('/', (req, res) => {
  res.send('Hello Chetan, I am Priya')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


