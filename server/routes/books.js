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

    client.query('SELECT * FROM anotherbooks', function(err, result) {
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

  client.query('INSERT INTO anotherbooks (title, author, edition, published, publisher, genre) '
              +  'VALUES ($1, $2, $3, $4, $5, $6)',
              [book.title, book.author, book.edition, book.published, book.publisher, book.genre],
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

router.put('/:id', function (req, res){
  var id = req.params.id;
  var book = req.body;
  console.log(req.body);
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
    res.sendStatus(500);
  }

  client.query('UPDATE anotherbooks ' +
                ' SET title = $1, ' +
                ' author = $2, ' +
                ' edition = $3, ' +
                ' published = $4, ' +
                ' publisher = $5, ' +
                ' genre = $6 ' +
                ' WHERE id = $7',
                [book.title, book.author, book.edition, book.published, book.publisher, book.genre, id],
              function (err, result) {
                done();

                if (err) {
                  console.log('err', err);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              });
  });
});

router.delete('/:id', function (req, res) {
  console.log("i work");
  var id = req.params.id;
console.log(id);
  pg.connect(connectionString, function (err, client, done) {
    console.log("connect");
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM anotherbooks ' +
                  'WHERE id = $1',
                  [id],
                  function (err, result) {
                    console.log('result', result);
                    done();

                    if (err) {
                      console.log("err", err);

                      res.sendStatus(500);
                      return;
                    }

                    res.sendStatus(200);
                  }
                )
  });
});

router.get('/:id', function (req, res) {
  console.log("i work");
  var genre = req.params.id;
console.log(genre);

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query("SELECT * FROM anotherbooks WHERE genre = '" + genre + "'", function(err, result) {
      done(); // closes connection, I only have 10!
      if(err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});


module.exports = router
