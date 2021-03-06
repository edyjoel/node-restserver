// ====================================
//  Puerto
// ====================================

process.env.PORT = process.env.PORT || 3000;

// ====================================
//  Entorno
// ====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================
//  Vencimiento del Token
// ====================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD = 60 * 60 * 24 * 30;

// ====================================
//  SEED de autenticacion
// ====================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ====================================
//  Base de datos
// ====================================

let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
}else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

// ====================================
//  Google Cliente ID
// ====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '962070015087-oaeprebv6m70gtpqn5ou7nll8t4ppb4e.apps.googleusercontent.com'

