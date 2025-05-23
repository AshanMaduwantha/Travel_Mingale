import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';


import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import hotelsRouter from "./routes/hotels.js";

import reservationRoutes from './routes/reservationRoutes.js';



import reviewRoutes from './routes/reviewRoutes.js';



const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173', "http://localhost:5174"]

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));


//API endpoint
app.get('/', (req, res) => res.send('API Working!'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

//Oshadhie 
app.use("/api/hotels", hotelsRouter);

//kavindu
app.use('/api/reservations', reservationRoutes);


//pamuditha
app.use("/api/reviews", reviewRoutes);


app.listen(port, ()=> console.log(`Server is running on port ${port}`));    