require( './db' );
const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const Sound = mongoose.model('Sound');

// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded());
app.use(express.json());
const logger = (req, res, next) => {
  console.log(req.method, req.path, req.query);
  next();
};

app.use((req, res, next) => {
  if(req.get('Host')) {
     next();
  } else {
    res.status(400).send('invalid request... add a host header plz');
  }
});

app.use(logger);

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

const sessionOptions = {
	secret: 'secret for signing session id',
	saveUninitialized: false,
	resave: false
};
app.use(session(sessionOptions));
// app.use(count);

app.use(function(req, res, next){
  res.locals.count = 0;
  next();
});

app.get('/', function(req, res) {
  req.session.count = req.session.count || 0;
  req.session.count++;
  // res.send('viewed ' + n + ' times\n');
  console.log(req.session.count);
	Sound.find(function(err, sounds, count) {
    // console.log(err, sounds, count);
		res.render( 'index', {
			sounds: sounds,
      count: req.session.count
		});
	});
  // req.session.count = req.session.count || 1;
  // req.session.count++;
  // // res.send('viewed ' + n + ' times\n');
  // console.log(req.session.count);
  // res.locals.count++;
  // res.render('mine', {count: req.session.count});
});

app.get('/sounds/add', function(req, res) {
  req.session.count = req.session.count || 0;
  req.session.count++;
  res.render('add', {
    count: req.session.count
  });
});

app.post('/sounds/add', function(req, res) {
  req.session.count = req.session.count || 0;
  req.session.count++;
	// console.log(req.body.what);
	new Sound({
		what: req.body.what,
    where: req.body.where,
    date: req.body.date,
    hour: req.body.hour,
    desc: req.body.desc
	}).save(function(err, sound, count){
		res.redirect('/');
	});
});




// app.get('/add', (req, res) => {
//   const params = req.query;
//
//   res.render('add', defaultArt);
// });



app.listen(3000);
