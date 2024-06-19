const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute.js');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser);
app.use(authRoute);
app.use(userRoute);
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
