const { mongoose } = require("mongoose");
const depositModel = mongoose.Schema({
  payment_id: { type: String, reuquired: true },
  payment_status: { type: String, required: true },
  user_id: { type: String, reuquired: true },
  pay_address: { type: String, reuquired: true },
  minimum_amount: {
    type: mongoose.Types.Decimal128,
    default: "0.00",
    required: false,
  },
  pay_amount: {
    type: mongoose.Types.Decimal128,
    default: "0.00",
    required: false,
  },
  pay_currency: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const deposit = mongoose.model("deposit", depositModel);
module.exports = deposit;
