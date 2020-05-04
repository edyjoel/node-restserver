require('./config/config');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// Configuracion global rutas
app.use(require('./routes/index'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public

app.use( express.static(path.resolve( __dirname, '../public') ) );


// Conectar Base de Datos

mongoose.connect(process.env.URLDB, 
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
                (err, res) => {
  if ( err ) throw err;

  console.log("Base de datos ONLINE");
});

app.listen(process.env.PORT, ()=> {
  console.log('Escuchando en el puerto', process.env.PORT);
});