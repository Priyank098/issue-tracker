const express = require('express');
const error_middleware  = require('./middleware/error_middleware');
require("dotenv").config({ path: `./src/env/${process.env.NODE_ENV}.env`});
require("./config/database")
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require("path")
const adminrouter = require("./routes/admin_route")
const userRouter = require("./routes/user_route")
const cookieParser = require("cookie-parser")
const cors = require("cors");
const app = express()

app.use(cors());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);

app.use(express.json());
app.use('/api',adminrouter );
app.use('/api',userRouter )
app.use('/checkout',require('./routes/razorpay'));

const PORT = process.env.PORT;
app.use(error_middleware)
app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})
// priyank