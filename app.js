const express = require('express');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const helmet = require("helmet");
require('dotenv').config();


mongoose.connect(process.env.DB_CONNECT,
{useNewUrlParser: true,
useUnifiedTopology: true})
.then(() => console.log('Connexion a MongoDB reussie !'))
.catch(() => console.log('Connexion a MongoDB echouee !'));

const app = express();

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.use(express.json());


  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/sauces', sauceRoutes);
  app.use('/api/auth', userRoutes);
  

module.exports = app;