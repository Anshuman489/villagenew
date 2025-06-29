const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Village = require('./models/Village');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://village-identification-frontend.onrender.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/village_identification';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Village Identification API is running!'
  });
});

// GET /api/villages - Get all villages with advanced filtering
app.get('/api/villages', async (req, res) => {
  try {
    const { 
      search, 
      district, 
      connectivity, 
      mechanizationPotential,
      minPopulation,
      maxPopulation,
      minFarmers,
      maxFarmers,
      crops,
      challenges,
      equipmentNeeded,
      fpoPresent,
      limit = 50 
    } = req.query;

    let filter = {};

    // Text search by name or district
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } }
      ];
    }

    // District filter
    if (district && district !== 'all') {
      filter.district = district;
    }

    // Connectivity filter
    if (connectivity && connectivity !== 'all') {
      filter.connectivity = connectivity;
    }

    // Mechanization potential filter
    if (mechanizationPotential && mechanizationPotential !== 'all') {
      filter.mechanizationPotential = mechanizationPotential;
    }

    // Population range filter
    if (minPopulation || maxPopulation) {
      filter.population = {};
      if (minPopulation) filter.population.$gte = parseInt(minPopulation);
      if (maxPopulation) filter.population.$lte = parseInt(maxPopulation);
    }

    // Farmers range filter
    if (minFarmers || maxFarmers) {
      filter.farmers = {};
      if (minFarmers) filter.farmers.$gte = parseInt(minFarmers);
      if (maxFarmers) filter.farmers.$lte = parseInt(maxFarmers);
    }

    // Crops filter (villages that grow specific crops)
    if (crops && crops !== 'all') {
      filter.majorCrops = { $in: [crops] };
    }

    // Challenges filter
    if (challenges && challenges !== 'all') {
      filter.challenges = { $in: [challenges] };
    }

    // Equipment needed filter
    if (equipmentNeeded && equipmentNeeded !== 'all') {
      filter.equipmentNeeded = { $in: [equipmentNeeded] };
    }

    // FPO present filter
    if (fpoPresent && fpoPresent !== 'all') {
      filter.fpoPresent = fpoPresent;
    }

    // Execute query
    const villages = await Village.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const total = await Village.countDocuments(filter);

    // Log filter for debugging
    console.log('🔍 Filter applied:', JSON.stringify(filter, null, 2));
    console.log(`📊 Found ${villages.length} villages matching criteria`);

    res.json({
      villages,
      total,
      filter: filter,
      message: `Found ${villages.length} villages${search ? ` matching "${search}"` : ''}`
    });
  } catch (error) {
    console.error('❌ Error fetching villages:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/villages/:id - Get single village
app.get('/api/villages/:id', async (req, res) => {
  try {
    const village = await Village.findById(req.params.id);
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }
    res.json(village);
  } catch (error) {
    console.error('Error fetching village:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/villages - Create new village
app.post('/api/villages', async (req, res) => {
  try {
    console.log('📝 Creating new village:', req.body.name);
    
    const village = new Village(req.body);
    const savedVillage = await village.save();
    
    console.log('✅ Village created successfully:', savedVillage.name);
    res.status(201).json(savedVillage);
  } catch (error) {
    console.error('❌ Error creating village:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/villages/:id - Update village
app.put('/api/villages/:id', async (req, res) => {
  try {
    const village = await Village.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
      { new: true, runValidators: true }
    );
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }
    res.json(village);
  } catch (error) {
    console.error('Error updating village:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/villages/:id - Delete village
app.delete('/api/villages/:id', async (req, res) => {
  try {
    const village = await Village.findByIdAndDelete(req.params.id);
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }
    res.json({ message: 'Village deleted successfully' });
  } catch (error) {
    console.error('Error deleting village:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/villages/stats/overview - Dashboard stats
app.get('/api/villages/stats/overview', async (req, res) => {
  try {
    const totalVillages = await Village.countDocuments();
    const totalPopulation = await Village.aggregate([
      { $group: { _id: null, total: { $sum: '$population' } } }
    ]);
    const totalFarmers = await Village.aggregate([
      { $group: { _id: null, total: { $sum: '$farmers' } } }
    ]);

    res.json({
      overview: {
        totalVillages,
        totalPopulation: totalPopulation[0]?.total || 0,
        totalFarmers: totalFarmers[0]?.total || 0
      },
      message: 'Stats retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Village Identification Backend API',
    endpoints: [
      'GET /api/health',
      'GET /api/villages',
      'POST /api/villages',
      'GET /api/villages/:id',
      'PUT /api/villages/:id',
      'DELETE /api/villages/:id'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Test the API:`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`   http://localhost:${PORT}/api/villages`);
  console.log(`📝 Ready to receive village data!`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});