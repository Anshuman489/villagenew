// models/Village.js
const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  district: { type: String, required: true },
  panchayat: { type: String },
  population: { type: Number },
  households: { type: Number },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Agricultural Data
  farmers: { type: Number },
  majorCrops: [{ type: String }],
  landArea: { type: Number },
  waterSources: [{ type: String }],
  farmingPractices: { type: String },
  
  // Infrastructure
  connectivity: { 
    type: String, 
    enum: ['Good', 'Poor', 'None', ''] 
  },
  roadAccess: { 
    type: String, 
    enum: ['Good', 'Moderate', 'Poor', ''] 
  },
  electricity: { 
    type: String, 
    enum: ['24/7', 'Partial', 'Limited', 'None', ''] 
  },
  marketDistance: { type: Number },
  
  // Community Structure
  shgCount: { type: Number },
  fpoPresent: { 
    type: String, 
    enum: ['Yes', 'No', 'In Formation', ''] 
  },
  villageInstitutions: [{ type: String }],
  
  // Challenges & Opportunities
  challenges: [{ type: String }],
  equipmentNeeded: [{ type: String }],
  mechanizationPotential: { 
    type: String, 
    enum: ['High', 'Medium', 'Low', ''] 
  },
  notes: { type: String },
  
  // Metadata
  status: { type: String, default: 'active' },
  createdBy: { type: String, default: 'Field Worker' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Village', villageSchema);