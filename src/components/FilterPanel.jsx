// src/components/FilterPanel.jsx
import React, { useState } from 'react';

const FilterPanel = ({ onFilterChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    district: 'all',
    connectivity: 'all',
    mechanizationPotential: 'all',
    minPopulation: '',
    maxPopulation: '',
    minFarmers: '',
    maxFarmers: '',
    crops: 'all',
    challenges: 'all',
    equipmentNeeded: 'all',
    fpoPresent: 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Only send non-empty and non-'all' filters to parent
    const activeFilters = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k] && newFilters[k] !== 'all' && newFilters[k] !== '') {
        activeFilters[k] = newFilters[k];
      }
    });
    
    onFilterChange(activeFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      district: 'all',
      connectivity: 'all',
      mechanizationPotential: 'all',
      minPopulation: '',
      maxPopulation: '',
      minFarmers: '',
      maxFarmers: '',
      crops: 'all',
      challenges: 'all',
      equipmentNeeded: 'all',
      fpoPresent: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(v => v && v !== 'all' && v !== '').length;
  };

  if (!isOpen) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-700 font-medium">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Show Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Villages</h3>
        <div className="space-x-2">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-700 text-sm"
          >
            Clear All
          </button>
          <button
            onClick={onToggle}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Hide Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Basic Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <select
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Districts</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Indore">Indore</option>
            <option value="Jabalpur">Jabalpur</option>
            <option value="Gwalior">Gwalior</option>
            <option value="Ujjain">Ujjain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
          <select
            value={filters.connectivity}
            onChange={(e) => handleFilterChange('connectivity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Any Connectivity</option>
            <option value="Good">Good</option>
            <option value="Poor">Poor</option>
            <option value="None">None</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mechanization Potential</label>
          <select
            value={filters.mechanizationPotential}
            onChange={(e) => handleFilterChange('mechanizationPotential', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Any Potential</option>
            <option value="High">High Potential</option>
            <option value="Medium">Medium Potential</option>
            <option value="Low">Low Potential</option>
          </select>
        </div>

        {/* Population Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Population</label>
          <input
            type="number"
            placeholder="e.g., 200"
            value={filters.minPopulation}
            onChange={(e) => handleFilterChange('minPopulation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Population</label>
          <input
            type="number"
            placeholder="e.g., 5000"
            value={filters.maxPopulation}
            onChange={(e) => handleFilterChange('maxPopulation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Farmers Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Farmers</label>
          <input
            type="number"
            placeholder="e.g., 50"
            value={filters.minFarmers}
            onChange={(e) => handleFilterChange('minFarmers', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Farmers</label>
          <input
            type="number"
            placeholder="e.g., 500"
            value={filters.maxFarmers}
            onChange={(e) => handleFilterChange('maxFarmers', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Crops Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Major Crop</label>
          <select
            value={filters.crops}
            onChange={(e) => handleFilterChange('crops', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Any Crop</option>
            <option value="Rice">Rice</option>
            <option value="Wheat">Wheat</option>
            <option value="Soybeans">Soybeans</option>
            <option value="Cotton">Cotton</option>
            <option value="Sugarcane">Sugarcane</option>
            <option value="Pulses">Pulses</option>
          </select>
        </div>

        {/* Equipment Needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Needed</label>
          <select
            value={filters.equipmentNeeded}
            onChange={(e) => handleFilterChange('equipmentNeeded', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Any Equipment</option>
            <option value="Tractors">Tractors</option>
            <option value="Harvesters">Harvesters</option>
            <option value="Irrigation Systems">Irrigation Systems</option>
            <option value="Spray Machines">Spray Machines</option>
            <option value="Threshers">Threshers</option>
          </select>
        </div>

        {/* FPO Present */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">FPO Status</label>
          <select
            value={filters.fpoPresent}
            onChange={(e) => handleFilterChange('fpoPresent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Any FPO Status</option>
            <option value="Yes">FPO Present</option>
            <option value="No">No FPO</option>
            <option value="In Formation">FPO In Formation</option>
          </select>
        </div>

        {/* Challenges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Challenges</label>
          <select
            value={filters.challenges}
            onChange={(e) => handleFilterChange('challenges', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Any Challenge</option>
            <option value="Water Shortage">Water Shortage</option>
            <option value="Poor Soil Quality">Poor Soil Quality</option>
            <option value="Lack of Machinery">Lack of Machinery</option>
            <option value="Market Access">Market Access</option>
            <option value="Labor Shortage">Labor Shortage</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              handleFilterChange('mechanizationPotential', 'High');
              handleFilterChange('connectivity', 'Good');
            }}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
          >
            🚀 High Potential Villages
          </button>
          
          <button
            onClick={() => {
              handleFilterChange('equipmentNeeded', 'Tractors');
              handleFilterChange('minFarmers', '100');
            }}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            🚜 Need Tractors
          </button>
          
          <button
            onClick={() => {
              handleFilterChange('challenges', 'Water Shortage');
            }}
            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm hover:bg-orange-200 transition-colors"
          >
            💧 Water Issues
          </button>
          
          <button
            onClick={() => {
              handleFilterChange('fpoPresent', 'No');
              handleFilterChange('mechanizationPotential', 'High');
            }}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
          >
            🏢 Need FPO
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;