const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: String,
  score: Number,
  price: Number,
  currency: String,
  rank: Number
}, {
  collection: 'Cpu_Bench'
});

const CpuBench = mongoose.model('CpuBench', Schema);


module.exports = CpuBench;