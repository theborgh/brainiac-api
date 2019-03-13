const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
   client: 'pg',
   connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'brainiac'
   }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT;

app.get('/', (req, res) => res.send('it is working')); //app.get('/', (req, res) => res.send(database.users));
app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db));
app.post('/imageurl', (req, res) => image.handleAPICall(req, res));

app.listen(PORT || 3000, () => {
   console.log(`Server is running on port ${PORT}`);
});