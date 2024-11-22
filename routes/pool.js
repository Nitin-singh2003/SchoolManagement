var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : 'localhost',
  user            : 'root',
  password        : '1234',
  database        : 'school_management', 
   insecureAuth : true
});

module.exports=pool;