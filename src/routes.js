const express = require('express');
const CategoryController = require('./controllers/CategoryController');
const BillsController = require('./controllers/BillsController');
const MovesController = require('./controllers/MovesController');
const EstimatesController = require('./controllers/EstimatesController');
const InvoicesControler = require('./controllers/InvoicesController');
const MonthController = require('./controllers/MonthController');
const PaymentTypesController = require('./controllers/PaymentTypeController');
const UsersController = require('./controllers/UsersController');
const routes = express.Router();

routes.post('/auth', UsersController.auth);
routes.post('/user', UsersController.create);

routes.post('/category', CategoryController.create);
routes.get('/categories', CategoryController.index);
routes.delete('/category/:id', CategoryController.delete);

routes.post('/bill', BillsController.create);
routes.delete('/bill/:id', BillsController.delete);
routes.get('/bills', BillsController.index);
routes.patch('/bill/close', BillsController.close);
routes.patch('/bill/pay', BillsController.pay);

routes.post('/move', MovesController.create);
routes.get('/moves', MovesController.index);
routes.delete('/move/:id', MovesController.delete);

routes.get('/open', MovesController.open);
routes.get('/paid', MovesController.paid);

routes.post('/estimate', EstimatesController.create);
routes.get('/estimates', EstimatesController.index);

routes.post('/invoice', InvoicesControler.create);
routes.get('/invoices', InvoicesControler.index);

routes.get('/month_name', MonthController.getMonthName);

routes.post('/payment_type', PaymentTypesController.create);
routes.get('/payment_types', PaymentTypesController.index);

module.exports = routes;