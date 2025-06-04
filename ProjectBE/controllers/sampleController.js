const Sample = require('../models/event');

exports.createSample = async (req, res) => {
  try {
    const sample = await Sample.create(req.body);
    res.status(201).json(sample);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSamples = async (req, res) => {
  try {
    const samples = await Sample.find();
    res.status(200).json(samples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
