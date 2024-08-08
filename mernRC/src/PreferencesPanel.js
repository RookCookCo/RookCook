import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PreferencesPanel.css';

const PreferencesPanel = ({ setShowPreferencesPanel }) => {
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPreferences, setFilteredPreferences] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null); // Reference for dropdown container

    // Load saved preferences from localStorage on component mount
    useEffect(() => {
        const savedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
        console.log('Loaded Preferences:', savedPreferences); // Debug log
        if (Array.isArray(savedPreferences)) {
            setSelectedPreferences(savedPreferences);
        }
    }, []);

    // Save preferences to localStorage whenever they change
    useEffect(() => {
        console.log('Saving Preferences:', selectedPreferences); // Debug log
        localStorage.setItem('selectedPreferences', JSON.stringify(selectedPreferences));
    }, [selectedPreferences]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, areasRes] = await Promise.all([
                    axios.get('https://www.themealdb.com/api/json/v2/9973533/categories.php'),
                    axios.get('https://www.themealdb.com/api/json/v2/9973533/list.php?a=list')
                ]);

                const allPreferences = [
                    ...categoriesRes.data.categories.map(cat => cat.strCategory),
                    ...areasRes.data.meals.map(area => area.strArea)
                ];

                setCategories(categoriesRes.data.categories);
                setAreas(areasRes.data.meals);
                setFilteredPreferences(allPreferences);
            } catch (error) {
                console.error('Error fetching categories and areas:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = filteredPreferences.filter(item =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPreferences(filtered);
        } else {
            setFilteredPreferences([
                ...categories.map(cat => cat.strCategory),
                ...areas.map(area => area.strArea)
            ]);
        }
    }, [searchQuery, categories, areas]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false); // Hide dropdown when clicking outside
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
            setSearchQuery(''); // Clear the search query when adding a preference
            setShowDropdown(false); // Close the dropdown after selecting
            localStorage.setItem('selectedPreferences', JSON.stringify(updatedPreferences)); // Save immediately
        }
    };

    const handleDeletePreference = (preference) => {
        const updatedPreferences = selectedPreferences.filter(pref => pref !== preference);
        setSelectedPreferences(updatedPreferences);
        localStorage.setItem('selectedPreferences', JSON.stringify(updatedPreferences)); // Save immediately
    };

    const handlePreferenceClick = (preference) => {
        handleAddPreference(preference);
        setFilteredPreferences(filteredPreferences.filter(pref => pref !== preference));
    };

    return (
        <div className="preferences-panel">
           <div className="panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
                <button className="exit-button" onClick={() => setShowPreferencesPanel(false)} style={{ position: 'absolute', top: '15px', left: '15px' }}>X</button>
                <h3 style={{ marginLeft: '0px', marginRight: '50px', fontSize: '18px' }}>Preferences</h3>
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
                        {filteredPreferences.map((preference, index) => (
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
        </div>
    );
};

export default PreferencesPanel;