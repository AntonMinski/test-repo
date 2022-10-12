const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// env variables
require('dotenv').config();

// cors
const cors = require('cors');
app.use(cors());

// bodyparser
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db connection
require('./config/mongodb.config').sync;

// logger
const useMorganLogger = require('./services/logging.service');
useMorganLogger(app);

// middleware
const authenticationMiddleware = require('./middleware/authentication.middleware');
const loggerMiddleware = require('./middleware/logger.middleware');

// router
const authRoutes = require('./controllers/auth.controller');
app.use('/api/auth', loggerMiddleware, authRoutes);
const tenantRotes = require('./controllers/tenant.controller');
app.use('/api/tenants', authenticationMiddleware, tenantRotes);

// server
const port = process.env.PORT || 3000;
app.listen(port, function(err) {
  if (err) console.log(err);
  console.log("System is running on port", port, "in", app.settings.env, "mode.");
});
