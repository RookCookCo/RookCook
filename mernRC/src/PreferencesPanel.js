import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PreferencesPanel.css';

const PreferencesPanel = ({ setShowPreferencesPanel }) => {
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPreferences, setFilteredPreferences] = useState([]);
  const [allPreferences, setAllPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
    if (Array.isArray(savedPreferences)) {
      setSelectedPreferences(savedPreferences);
    }
  }, []);

  // Save preferences to localStorage on panel close
  const handleClosePanel = () => {
    setShowPreferencesPanel(false);
    localStorage.setItem('selectedPreferences', JSON.stringify(selectedPreferences));
  };

  // Fetch categories and areas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, areasRes] = await Promise.all([
          axios.get('https://www.themealdb.com/api/json/v2/9973533/categories.php'),
          axios.get('https://www.themealdb.com/api/json/v2/9973533/list.php?a=list')
        ]);

        const categoriesData = categoriesRes.data.categories.map(cat => cat.strCategory);
        const areasData = areasRes.data.meals.map(area => area.strArea);
        const allPrefs = [...categoriesData, ...areasData];

        setCategories(categoriesRes.data.categories);
        setAreas(areasRes.data.meals);
        setAllPreferences(allPrefs);
        setFilteredPreferences(allPrefs);
      } catch (error) {
        console.error('Error fetching categories and areas:', error);
      }
    };

    fetchData();
  }, []);

  // Update filtered preferences based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = allPreferences.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPreferences(filtered);
    } else {
      setFilteredPreferences(allPreferences);
    }
  }, [searchQuery, allPreferences]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddPreference = (preference) => {
    if (preference && !selectedPreferences.includes(preference)) {
      const updatedPreferences = [...selectedPreferences, preference];
      setSelectedPreferences(updatedPreferences);
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  const handleDeletePreference = (preference) => {
    const updatedPreferences = selectedPreferences.filter(pref => pref !== preference);
    setSelectedPreferences(updatedPreferences);
  };

  const handlePreferenceClick = (preference) => {
    handleAddPreference(preference);
    setFilteredPreferences(filteredPreferences.filter(pref => pref !== preference));
  };

  return (
    <div className="preferences-panel">
      <div className="panel-header">
        <button className="exit-button" onClick={handleClosePanel}>X</button>
        <h3 style={{ marginLeft: '135px', marginRight: '20px' }}>Preferences</h3>
      </div>
      <div className="preferences-search" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search preferences..."
          value={searchQuery}
          onClick={() => setShowDropdown(!showDropdown)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="preferences-search-input"
        />
        {showDropdown && (
          <ul className="preferences-dropdown">
            {filteredPreferences
              .filter(pref => !selectedPreferences.includes(pref)) // Exclude selected preferences
              .map((preference, index) => (
                <li
                  key={index}
                  onClick={() => handlePreferenceClick(preference)}
                >
                  {preference}
                </li>
              ))}
          </ul>
        )}
      </div>
      {selectedPreferences.length > 0 && (
        <div className={`selected-preferences ${selectedPreferences.length > 7 ? 'scrollable' : ''}`}>
          <h3>Your Preferences</h3>
          <ul>
            {selectedPreferences.map(pref => (
              <li key={pref}>
                {pref}
                <button className="delete-button" onClick={() => handleDeletePreference(pref)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="preferences-footer">
        <p>
          Your preferences will influence the recipes that are generated. If you have specific tastes or dietary restrictions, make sure to adjust your preferences accordingly to get the most relevant recipe suggestions!
        </p>
      </div>
    </div>
  );
};

export default PreferencesPanel;