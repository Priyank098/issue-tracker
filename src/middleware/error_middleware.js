const dashLogger = require("../utils/logger");
const error_middleware = (err, req, res, next) => {
  dashLogger.error(`Error : ${err.message},Request : ${req.originalUrl},stack:${err.stack}`);
  if (!err.cause){
    console.log(err);
    res.status(500).json({ success:false,error: err.message });

  }
  else{
    console.log(err);
    res.status(err.cause.status).json({ success:false,error: err.message });
  }
}

module.exports =  error_middleware 