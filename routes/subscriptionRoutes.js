const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Viewer = require('../models/Viewer');
const Creator = require('../models/Creator');

// GET all subscriptions for a viewer
router.get('/:viewerUsername', async (req, res) => {
  try {
    const { viewerUsername } = req.params;
    const viewer = await Viewer.findOne({ username: viewerUsername });
    if (!viewer) {
      return res.status(404).json({ message: 'Viewer not found' });
    }

    const subscriptions = await Subscription.find({ viewer: viewerUsername });
    res.json(subscriptions);
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new subscription
router.post('/', async (req, res) => {
  try {
    const { viewerUsername, creatorUsername, planType, price } = req.body;

    // Validate viewer and creator
    const viewer = await Viewer.findOne({ username: viewerUsername });
    const creator = await Creator.findOne({ username: creatorUsername });
    if (!viewer || !creator) {
      return res.status(404).json({ message: 'Viewer or Creator not found' });
    }

    // Check if subscription already exists
    const existingSubscription = await Subscription.findOne({
      viewer: viewerUsername,
      creator: creatorUsername,
      status: 'active',
    });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Subscription already exists' });
    }

    // Calculate subscription end date (1 month from now)
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const newSubscription = new Subscription({
      viewer: viewerUsername,
      creator: creatorUsername,
      planType,
      price,
      currentPeriodEnd,
    });

    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (err) {
    console.error('Error creating subscription:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT cancel a subscription
router.put('/:id/cancel', async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: 'canceled' },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (err) {
    console.error('Error canceling subscription:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT renew a subscription
router.put('/:id/renew', async (req, res) => {
  try {
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: 'active', currentPeriodEnd },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (err) {
    console.error('Error renewing subscription:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;