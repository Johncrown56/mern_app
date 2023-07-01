const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware')
const colors = require('colors');
const connectDB = require('./config/db')

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/api/goals', require('./routes/goalsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));