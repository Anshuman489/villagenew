// src/components/VillageForm.jsx
import React, { useState } from 'react';

const VillageForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    district: '',
    panchayat: '',
    population: '',
    households: '',
    coordinates: { lat: '', lng: '' },
    
    // Agricultural Data
    farmers: '',
    majorCrops: [],
    landArea: '',
    waterSources: [],
    farmingPractices: '',
    
    // Infrastructure
    connectivity: '',
    roadAccess: '',
    electricity: '',
    marketDistance: '',
    
    // Community Structure
    shgCount: '',
    fpoPresent: '',
    villageInstitutions: [],
    
    // Challenges & Opportunities
    challenges: [],
    equipmentNeeded: [],
    mechanizationPotential: '',
    notes: ''
  });

  const cropOptions = ['Rice', 'Wheat', 'Soybeans', 'Cotton', 'Sugarcane', 'Pulses', 'Vegetables', 'Fruits'];
  const waterSourceOptions = ['Wells', 'Rivers', 'Rainfall', 'Irrigation Canals', 'Ponds', 'Tube Wells'];
  const challengeOptions = ['Water Shortage', 'Poor Soil Quality', 'Lack of Machinery', 'Market Access', 'Labor Shortage', 'Climate Issues', 'Pest Control'];
  const equipmentOptions = ['Tractors', 'Harvesters', 'Irrigation Systems', 'Spray Machines', 'Threshers', 'Cultivators'];
  const institutionOptions = ['Self Help Groups', 'Cooperative Society', 'Farmer Producer Organization', 'Village Committee'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add timestamp and generate ID
    const villageData = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    onSubmit(villageData);
    
    // Reset form
    setFormData({
      name: '', district: '', panchayat: '', population: '', households: '',
      coordinates: { lat: '', lng: '' }, farmers: '', majorCrops: [], landArea: '',
      waterSources: [], farmingPractices: '', connectivity: '', roadAccess: '',
      electricity: '', marketDistance: '', shgCount: '', fpoPresent: '',
      villageInstitutions: [], challenges: [], equipmentNeeded: [],
      mechanizationPotential: '', notes: ''
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add New Village</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Panchayat</label>
                <input
                  type="text"
                  name="panchayat"
                  value={formData.panchayat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                <input
                  type="number"
                  name="population"
                  value={formData.population}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Households</label>
                <input
                  type="number"
                  name="households"
                  value={formData.households}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Agricultural Data */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agricultural Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Farmers</label>
                <input
                  type="number"
                  name="farmers"
                  value={formData.farmers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Land Area (acres)</label>
                <input
                  type="number"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Major Crops</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {cropOptions.map(crop => (
                    <label key={crop} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.majorCrops.includes(crop)}
                        onChange={() => handleCheckboxChange('majorCrops', crop)}
                        className="mr-2"
                      />
                      <span className="text-sm">{crop}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Sources</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {waterSourceOptions.map(source => (
                    <label key={source} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.waterSources.includes(source)}
                        onChange={() => handleCheckboxChange('waterSources', source)}
                        className="mr-2"
                      />
                      <span className="text-sm">{source}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internet Connectivity</label>
                <select
                  name="connectivity"
                  value={formData.connectivity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select connectivity</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                  <option value="None">None</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Road Access</label>
                <select
                  name="roadAccess"
                  value={formData.roadAccess}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select road access</option>
                  <option value="Good">Good</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Electricity</label>
                <select
                  name="electricity"
                  value={formData.electricity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select electricity status</option>
                  <option value="24/7">24/7 Available</option>
                  <option value="Partial">Partial (8-16 hours)</option>
                  <option value="Limited">Limited (Less than 8 hours)</option>
                  <option value="None">No Electricity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance to Market (km)</label>
                <input
                  type="number"
                  name="marketDistance"
                  value={formData.marketDistance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Community Structure */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of SHGs</label>
                <input
                  type="number"
                  name="shgCount"
                  value={formData.shgCount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FPO Present</label>
                <select
                  name="fpoPresent"
                  value={formData.fpoPresent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="In Formation">In Formation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Challenges & Opportunities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenges & Opportunities</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Challenges</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {challengeOptions.map(challenge => (
                  <label key={challenge} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.challenges.includes(challenge)}
                      onChange={() => handleCheckboxChange('challenges', challenge)}
                      className="mr-2"
                    />
                    <span className="text-sm">{challenge}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Needed</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {equipmentOptions.map(equipment => (
                  <label key={equipment} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.equipmentNeeded.includes(equipment)}
                      onChange={() => handleCheckboxChange('equipmentNeeded', equipment)}
                      className="mr-2"
                    />
                    <span className="text-sm">{equipment}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mechanization Potential</label>
                <select
                  name="mechanizationPotential"
                  value={formData.mechanizationPotential}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select potential</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any additional observations or notes..."
              ></textarea>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Save Village
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VillageForm;