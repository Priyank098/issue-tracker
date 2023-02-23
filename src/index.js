const express = require('express');
const error_middleware  = require('./middleware/error_middleware');
require("dotenv").config({ path: `./src/env/${process.env.NODE_ENV}.env`});
require("./Config/database")
const adminrouter = require("./Routes/admin_route")
const userRouter = require("./Routes/user_route")

const app = express()
app.use(express.json());
app.use('/api',adminrouter );
app.use('/api',userRouter );

const PORT = process.env.PORT;
app.use(error_middleware)
app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})
