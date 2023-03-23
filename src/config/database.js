const conn=process.env.DB_URL;
const mongoose = require('mongoose');

const connectionParams={
    useNewUrlParser: true,  
    useUnifiedTopology: true,
}
mongoose.set('strictQuery',true)
mongoose.connect(conn,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })