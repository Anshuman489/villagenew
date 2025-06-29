// pages/VillageIdentification.jsx
import React, { useState, useEffect } from 'react';
import VillageForm from '../components/VillageForm';
import FilterPanel from '../components/FilterPanel';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { villageAPI } from '../services/api';

const VillageIdentification = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [villages, setVillages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    village: null,
    isDeleting: false
  });

  // Load villages when component mounts
  useEffect(() => {
    loadVillages();
  }, []);

  // Load villages from backend with filters
  const loadVillages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading villages with filters:', activeFilters);
      
      const data = await villageAPI.getVillages(searchTerm, activeFilters);
      setVillages(data.villages || []);
      
      console.log(`✅ Loaded ${data.villages?.length || 0} villages`);
    } catch (err) {
      setError('Failed to load villages: ' + err.message);
      console.error('❌ Error loading villages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log('🔍 Filters changed:', newFilters);
    setActiveFilters(newFilters);
  };

  // Load villages when filters change
  useEffect(() => {
    loadVillages();
  }, [activeFilters]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadVillages();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Add new village
  const handleAddVillage = async (villageData) => {
    try {
      setError(null);
      console.log('🔄 Creating village:', villageData.name);
      
      const newVillage = await villageAPI.createVillage(villageData);
      setVillages(prev => [newVillage, ...prev]);
      
      console.log('✅ Village created successfully!');
    } catch (err) {
      setError('Failed to add village: ' + err.message);
      console.error('❌ Error adding village:', err);
      throw err;
    }
  };

  // Delete village functions
  const handleDeleteClick = (village) => {
    setDeleteConfirmation({
      isOpen: true,
      village: village,
      isDeleting: false
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
      setError(null);
      
      await villageAPI.deleteVillage(deleteConfirmation.village._id);
      
      // Remove village from local state
      setVillages(prev => prev.filter(v => v._id !== deleteConfirmation.village._id));
      
      // Close confirmation dialog
      setDeleteConfirmation({ isOpen: false, village: null, isDeleting: false });
      
      console.log('✅ Village deleted successfully!');
    } catch (err) {
      setError('Failed to delete village: ' + err.message);
      console.error('❌ Error deleting village:', err);
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, village: null, isDeleting: false });
  };

  // Get display data for villages
  const displayVillages = villages;

  const getPotentialColor = (potential) => {
    switch(potential) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectivityColor = (connectivity) => {
    switch(connectivity) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Poor': return 'bg-yellow-100 text-yellow-800';
      case 'None': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading villages from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              <span className="text-red-800">{error}</span>
            </div>
            <button 
              onClick={loadVillages}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Village Identification</h1>
            <p className="text-gray-600 mt-1">
              Manage and identify villages for agricultural development
            </p>
            <p className="text-sm text-green-600 mt-1">
              {villages.length} village{villages.length !== 1 ? 's' : ''} in database
            </p>
          </div>
          
          <div className="flex space-x-3">
            {/* Clear All Button (for demo) */}
            {villages.length > 0 && (
              <button 
                onClick={() => {
                  if (window.confirm(`Delete all ${villages.length} villages? This cannot be undone.`)) {
                    setVillages([]);
                    console.log('🗑️ All villages cleared for demo');
                  }
                }}
                className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center text-sm"
              >
                🗑️ Clear All
              </button>
            )}
            
            {/* Add Village Button */}
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              disabled={loading}
            >
              + Add New Village
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search villages by name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            Showing {villages.length} village{villages.length !== 1 ? 's' : ''}
            {Object.keys(activeFilters).length > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Filtered
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        onFilterChange={handleFilterChange}
      />

      {/* Villages List */}
      {displayVillages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="h-24 w-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-gray-400">🏘️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No villages found' : 'No villages added yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No villages match "${searchTerm}"`
                : 'Start by adding your first village to the system'
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Add First Village
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVillages.map((village) => (
            <div key={village._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              
              {/* Village Header with Delete Button */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{village.name}</h3>
                  <p className="text-sm text-gray-600">{village.district}</p>
                </div>
                <div className="flex flex-col space-y-1 ml-2">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(village)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    title="Delete Village"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                  
                  {/* Status Badges */}
                  {village.mechanizationPotential && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPotentialColor(village.mechanizationPotential)}`}>
                      {village.mechanizationPotential} Potential
                    </span>
                  )}
                  {village.connectivity && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConnectivityColor(village.connectivity)}`}>
                      {village.connectivity} Internet
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Population:</span>
                  <span className="font-medium">{village.population || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Farmers:</span>
                  <span className="font-medium">{village.farmers || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Land Area:</span>
                  <span className="font-medium">{village.landArea ? `${village.landArea} acres` : 'N/A'}</span>
                </div>
                {village.majorCrops && village.majorCrops.length > 0 && (
                  <div>
                    <span>Major Crops:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {village.majorCrops.slice(0, 3).map((crop) => (
                        <span key={crop} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {crop}
                        </span>
                      ))}
                      {village.majorCrops.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{village.majorCrops.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Added {new Date(village.createdAt).toLocaleDateString()}
                  </span>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Village Form Modal */}
      <VillageForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddVillage}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        village={deleteConfirmation.village}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={deleteConfirmation.isDeleting}
      />
    </div>
  );
};

export default VillageIdentification;