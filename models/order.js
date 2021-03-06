const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const bomDB = mongoose.createConnection(mongoConfig.bomURL);

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const OrderSchema = new mongoose.Schema({
  requestor: String,
  item: String,
  subteam: String,
  supplier: String,
  productNum: String,
  quantity: String,
  totalCost: Number,
  indvPrice: String,
  tax: Number,
  shipping: Number,
  tax: Number,
  isApproved: {type: Boolean, default: false},
  approvedBy: String,
  trackingNum: String,
  dateRequested: {type: Date, default: Date.now},
  isOrdered: {type: Boolean, default: false},
  dateOrdered: Date,
  purchaser: String,
  comments: String,
  link: String,
  invoice: String,
  project: String,
  countsTowardPodCost: {type: Boolean, default: false},
  needDate: String,
  isDigikey: {type: Boolean, default: false},
  isReimbursement: {type: Boolean, default: false},
  messageId: mongoose.ObjectId
});

OrderSchema.index({'$**': 'text'}, {
// weights: {
//   requestor: 5,
//   item: 4,
//   subteam: 3,
//   supplier: 2,
//   productNum: 5,
//   purchaser: 4
// }
});

let orderModel = bomDB.model('Orders', OrderSchema);
module.exports = orderModel;

