const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const config = require('config');
const awsManager = require('./aws').AWSManager;
const uuidv1 = require('uuid/v1');
const helmet = require('helmet');

const API_PORT = 3001;
const app = express();
app.use(cors());
app.use(helmet());
const router = express.Router();

// this is our MongoDB database
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

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// get the URL where images are hosted
router.get('/getConfig', (req, res) => {
  const contentUrl = awsManager.instance().content_url_s3()
  const config = {
    contentUrl: contentUrl,
  }
  res.json({ success: true, config });
})

// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// removes existing data in our database, and 
// deletes the associated s3 object
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findById(id, (err, data) => {
    if (err) return res.send(err);
    awsManager.instance().delete_s3(data.fileName,
      () => {
        Data.findByIdAndDelete(id, (err) => {
          if (err) return res.send(err);
          return res.json({ success: true });
        });
      },
      err => {
        return res.json({ success: false });
      }
    );
  });
});

// get URL for uploading
router.post('/getUploadUrl', (req, res) =>{
  const fileName = uuidv1()
  awsManager.instance().sign_s3(fileName, req.body.fileType,
    data => {
      return res.json({success: true, data: { signedRequest: data, fileName: fileName}})
    },
    err => {
      return res.json({ success: false })
    }
  )
})

// this method adds a new post
router.post('/putData', (req, res) => {
  Data.create(req.body, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    console.log(data)
    return res.json({ success: true })
  })
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
