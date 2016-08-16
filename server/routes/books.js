var express = require ('express');
var router = express.Router();
var pg = require('pg'); //This connects to db
var connectionString = 'postgres://localhost:5432/omicron'; //this is the actual connection

router.get('/', function (req, res) {
  //Retrieve books from database
  //connectionString is the connection and then function. err - error, client - this is where we query
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function(err, result) {
      done(); // closes connection, I only have 10!
      if(err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var book = req.body;


  pg.connect(connectionString, function (err, client, done) {
  if (err) {
    res.sendStatus(500);
  }

  client.query('INSERT INTO books (author, title, published, edition, publisher) '
              +  'VALUES ($1, $2, $3, $4, $5)',
              [book.author, book.title, book.published, book.edition, book.publisher],
              function (err, result){
                done();
                console.log('i work');
                if (err) {
                  res.sendStatus(500);
                }


                res.sendStatus(201); // 201 - created
              });
  });
});

module.exports = router
