const express = require('express');
const error_middleware  = require('./middleware/error_middleware');
require("dotenv").config({ path: `./src/env/${process.env.NODE_ENV}.env`});
require("./config/database")
const adminrouter = require("./routes/admin_route")
const userRouter = require("./routes/user_route")
const cors = require("cors");

const app = express()
app.use(cors());

app.use(express.json());
app.use('/api',adminrouter );
app.use('/api',userRouter );

const PORT = process.env.PORT;
app.use(error_middleware)
app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})
// priyank