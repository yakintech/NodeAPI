var app = require('express')();
var server = require('http').Server(app);
var conf = require('./config');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const { check, validationResult } = require('express-validator');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

console.log(uuidv1())

const Pool = require('pg').Pool
const db = new Pool({
    user: conf.sql.user,
    host: conf.sql.host,
    database: conf.sql.database,
    password: conf.sql.password,
    port: conf.sql.port,
    ssl:conf.sql.ssl
});

app.get('/category/list', function (req, res) {
  db.query(`select * from category`,(err,result)=>{
    res.json(result.rows);
  })
});


app.get('/category/detail/:id',function(req,res){
  console.log(req.params);
  db.query(`select * from category where id = '` + req.params.id + `'`,function(err,result){
    res.json(result.rows);
  })

  // db.query(`select * from category where id = '` + req.query.id + `'`,function(err,result){
  //   res.json(result.rows);
  // })
})

app.get('/category/topcategory',function(req,res){
  db.query(`select * from category limit  ` + req.query.count ,function(err,result){
    res.json(result.rows);
  })
});

app.post('/category/add', [
  check('name').not().isEmpty(),
  check('description').isLength({ min: 3 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  else{
    var id = uuidv1();
    var name = req.query.name;
    var description = req.query.description;
    db.query(`INSERT INTO public.category(
      id, name, description, isdelete, addate)
      VALUES ('`+ id +`','` + name +`','` + description + `',false, now());`,function(err,result){
    
        if(!err){
          console.log(result);
          res.status(200).send("İşlem Başarılı!");
        }
        else{
          res.status(400).send("İşlem başarısız. Eksik parametre!")
        }
      })
  }
});

app.post('/category/delete',[
  check('id').not().isEmpty()
],(req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  else{
    var id = req.query.id;
    db.query(`update category set isdelete = true where id = '` + id + `'`,function(err){
      if(err){
        console.log(err);
        res.status(400).send("İşlem hatalı!");
      }  
      else{
        res.send("İşlem başarılı");
      }
    })
  }
});

  server.listen(3000, function () {
    console.log('listening on *:' + 3000);
});



