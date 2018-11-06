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

app.get('/', function(req, res) {
  req.session.count = req.session.count || 0;
  req.session.count++;
  // res.send('viewed ' + n + ' times\n');
  console.log(req.session.count);

  const params = req.query;
  for (var propName in params) {
    if (params[propName] == "") {
      delete params[propName];
    }
  }
	Sound.find( params, function(err, sounds, count) {
    // console.log(err, sounds, count);
		res.render( 'index', {
			sounds: sounds,
      count: req.session.count
		});
	});
});

app.get('/sounds/add', function(req, res) {
  req.session.count = req.session.count || 0;
  req.session.count++;
  res.render('add', {
    count: req.session.count
  });
});

app.post('/sounds/add', function(req, res) {

  var newSound = new Sound({
		what: req.body.what,
    where: req.body.where,
    date: req.body.date,
    hour: req.body.hour,
    desc: req.body.desc
	});

  req.session.count = req.session.count || 0;
  req.session.count++;

  req.session.mine = req.session.mine || [];
  req.session.mine.push(newSound);
	newSound.save(function(err, sound, count){
		res.redirect('/');
	});
});

app.get('/sounds/mine', function(req, res) {
  req.session.count = req.session.count || 0;
  req.session.count++;
  res.render('mine', {
    sounds: req.session.mine,
    count: req.session.count
  });
});

app.listen(3000);
