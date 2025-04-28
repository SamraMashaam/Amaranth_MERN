const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  viewer: {
    type: String, // Viewer username
    required: true,
  },
  creator: {
    type: String, // Creator username
    required: true,
  },
  planType: {
    type: String,
    enum: ['Basic', 'Premium'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'canceled'],
    default: 'active',
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;