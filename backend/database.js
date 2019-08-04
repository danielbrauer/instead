const mongoose = require('mongoose')
const config = require('config')

const dbConfig = config.get('Customer.dbConfig');
const scheme = dbConfig.get('scheme');
const user = encodeURIComponent(dbConfig.get('user'));
const password = encodeURIComponent(dbConfig.get('password'));
const host = dbConfig.get('host');
const path = dbConfig.get('path');
const query = dbConfig.get('query');
const dbRoute = `${scheme}://${user}:${password}@${host}/${path}?${query}`;

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));