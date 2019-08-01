require('dotenv').config();

const PORT = process.env.port || 7000;

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const http = require('http');

const ordersController = require('./controllers/orders');
const authController = require('./controllers/auth');
const eventsController = require('./controllers/events');
const adminController = require('./controllers/admin');
const budgetController = require('./controllers/budgets');

const mongoConfig = require('./config/mongo');
const passportConfig = require('./config/passport');

const app = module.exports.app = express();
const server = http.createServer(app);
server.listen(7000);
console.log(`The party is happening on ${PORT}, who do you know here?`)


mongoose.connect(mongoConfig.url, {useNewUrlParser: true});

app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

app.get('/', (req, res) => {
  res.render('homePage', {
    user: req.user,
    activeDashboard: true
  });
});

app.get('/orders/purchase',  ordersController.getMakeOrder);
app.post('/orders/purchase', ordersController.postMakeOrder);
app.get('/orders/view', passportConfig.isAuthenticated, ordersController.getViewOrders);
app.post('/orders/view', passportConfig.isAuthenticated, ordersController.postViewOrders);
app.get('/orders/edit/:id', ordersController.getEditOrders);
app.post('/orders/edit', ordersController.postEditOrder);
app.get('/orders/cancel', ordersController.getCancelOrder);
app.get('/orders/place/:id', ordersController.getOrdering);
app.get('/orders/approve/:id', ordersController.getApproving);

app.get('/slack/auth', passport.authenticate('slack'));
app.get('/slack/auth/redirect', passport.authenticate('slack'), (req, res) => res.redirect('/'));
app.get('/logout', authController.getLogout);

app.get('/admin/dashboard', passportConfig.isAuthenticated, adminController.getDash);
app.get('/admin/set', passportConfig.isAuthenticated, adminController.setUser);
app.get('/admin/createbudget', passportConfig.isAuthenticated, adminController.createBudget);

app.get('/budget/edit', passportConfig.isAuthenticated, budgetController.getEdit);
app.post('/budget/createBudget', budgetController.createBudgets);
app.get('/budget/delete', passportConfig.isAuthenticated, budgetController.getDelete);
app.get('/slack/reaction?challenge=:event', eventsController.getEvent);

