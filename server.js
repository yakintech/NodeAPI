var app = require('express')();
var server = require('http').Server(app);
var conf = require('./config');
const bodyParser = require('body-parser');
var validator = require('validator');

console.log(validator.isEmail('fooasdasd')); 



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const Pool = require('pg').Pool
const db = new Pool({
    user: conf.sql.user,
    host: conf.sql.host,
    database: conf.sql.database,
    password: conf.sql.password,
    port: conf.sql.port,
    ssl:conf.sql.ssl
});

app.get('/', function (req, res) {
  res.json({ status: 'success', message: 'Book added.' })
});

app.post('/',function(req,res){
  res.status(200).send("son olarak");
})

  server.listen(3000, function () {
    console.log('listening on *:' + 3000);
});