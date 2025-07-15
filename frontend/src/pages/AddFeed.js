import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from '@clerk/clerk-react';
import { addFeedService, fetchAllFeeds, updateFeedService } from '../services/feedService';
import { fetchAllIngredients, getIngredientByUserId } from '../services/ingredientService';
import { Toast } from 'primereact/toast';
import { useNavigate, useLocation } from 'react-router';
import { downloadCSV } from '../utils/downloadCSV';
import { FloatLabel } from 'primereact/floatlabel';
import { FeedForm } from '../components/FeedForm';
import { useUserRole } from '../utils/UserRole';

const AddFeed = () => {
    const { getToken } = useAuth();
    const toast = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const feedFormRef = useRef(null);
    const { role } = useUserRole();

    const feedData = location.state?.selectedFeeds;
    const [ingredients, setIngredients] = useState([]);
    const [selectedFeedId, setSelectedFeedId] = useState(null);
    const [initialFeedData, setInitialFeedData] = useState(null);
    const [ingLoading, setIngLoading] = useState(true);
    const [formulationResult, setFormulationResult] = useState({});
    const [existingFeedNames, setExistingFeedNames] = useState([]);
    const [feedNameExists, setFeedNameExists] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState('p.kg');

    useEffect(() => {
        if (feedData) {
            setSelectedFeedId(feedData[0].feed_id);
            setInitialFeedData(feedData[0]);
        }
    }, [feedData]);

    const handleMessage = ({ success, severity, message }) => {
        toast.current?.show({
          severity: severity,
          summary: success ? 'Success' : 'Error',
          detail: message,
          life: 3000
        });
    };

    // ======================================== Feed Name ==============================================
    // This function is used to fetch the existing feed names from the database
    // useCallback ensures the function is memoized and doesn't change between renders
    const fetchFeedName = useCallback(async () => {
        try {
            const token = await getToken();
            const response = await fetchAllFeeds(token, 0, 1000000);

            // Get only the feed_name and assign them to the existingFeedNames state
            const feedNames = response.data.map(feed => feed.feed_name);
            setExistingFeedNames(feedNames);
        } catch (error) {
            console.error("Error fetching feed names:", error);
        }
    }, [getToken]);

    // This only runs once on mount to fetch the feed data
    useEffect(() => {
        fetchFeedName();
    }, [fetchFeedName]);
    
    // ====================================== Ingredient table ============================================

    const loadIngredientData = useCallback(async () => {
        setIngLoading(true);
        try {
            const token = await getToken();
            let result;
            if (role === 'admin') {
                result = await fetchAllIngredients(token);
            } else {
                result = await getIngredientByUserId(token);
            }
            if (result && result.data) {
                setIngredients(result.data);
            } else {
                throw new Error('No ingredient data received');
            }
        } catch (err) {
            console.error("Error:", err);
            handleMessage({ success: false, severity: 'error', message: 'Failed to fetch ingredients.' });
            setIngredients([]); // Reset ingredients on error
        } finally {
            setIngLoading(false);
        }
    }, [getToken]);   
    
    useEffect(() => {
        loadIngredientData();
    }, [loadIngredientData]);

    // ====================================== Generate Feed ============================================
    // This function saves the feed and validate each field
    const saveFeed = async (feedData) => {
        try {
            setSaveLoading(true);
            if (feedNameExists) {
                const response = await updateFeedToDB(selectedFeedId, feedData);
                if (response && response.success) {
                    handleMessage({ success: true, severity: 'success', message: response.message});
                    setTimeout(() => {
                        navigate("/view-feeds");
                    }, 3500); 
                } else {
                    throw new Error(response?.message || "Unknown error occurred.");
                }
            } else {
                const response = await addFeedToDB(feedData);
                if (response && response.success) {
                    handleMessage({ success: true, severity: 'success', message: response.message});
                    setTimeout(() => {
                        navigate("/view-feeds");
                    }, 3500); 
                } else {
                    throw new Error(response?.message || "Unknown error occurred.");
                }
            }
        } catch (err) {
            console.error("Error saving feed:", err);
            handleMessage({ success: false, severity: 'error', message: err.error || 'Failed to save feed.' });
            setSaveLoading(false);
        } finally {
            setSaveLoading(false);
        }
    }

    const addFeedToDB = async (feed) => {
        try {
          const token = await getToken();
          const result = await addFeedService(feed, token);
          return result;
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setIngLoading(false);
        }
    }

    const updateFeedToDB = async (feedID, feedData) => {
        try {
          const token = await getToken();
          const result = await updateFeedService(feedID, feedData, token);
          return result;
        } catch (err) {
          console.error("Error:", err);
        } finally {
          setIngLoading(false);
        }
    }

    const [downloadCSVData, setDownloadCSVData] = useState({
        feedName: '',
        creationDate: '',
        ingredientPercentages: []
    });

    var feedInCSV = {
        "feedName": "",
        "creationDate": "",
        "ingredientPercentages": {}
    };
    
    const download = () => {
        if (!feedFormRef.current?.checkDownloadCSV()) {
            handleMessage({ success: false, severity: 'error', message: 'Please ensure formulation total is within the range.' });
            return;
        }

        feedInCSV.feedName = downloadCSVData.feedName;
        if (feedInCSV.creationDate === "") {
            feedInCSV.creationDate = new Date().toISOString().split('T')[0];
        }

        // Transform the ingredientPercentages array into the required format
        feedInCSV.ingredientPercentages = downloadCSVData.ingredientPercentages.reduce((acc, item) => {
            acc[item.Name] = item.percentage;
            return acc;
        }, {});
        
        downloadCSV(feedInCSV, formulationResult);
    }

    return (
        <div className="px-5 py-3">
            <Toast ref={toast} position="top-right" />
            <div className="flex justify-content-between align-items-center mx-2">
                <h2 className="text-4xl md:text-4xl font-bold">
                    {selectedFeedId == null ? 'Add New Feed' : 'Add/Update Feed'}
                </h2>
                <div className="flex align-items-center">
                    <FloatLabel>
                        <Dropdown
                            placeholder="Select Unit"
                            options={[
                                { label: 'g.kg', value: 'p.kg' },
                                { label: '%', value: '%' },
                            ]}
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.value)}
                            className="mr-4"
                            disabled={ingLoading}
                        />
                        <label htmlFor="unit">Unit:</label>
                    </FloatLabel>
                    <Button
                        label="Download CSV"
                        icon="pi pi-download"
                        className="p-button-success"
                        style={{ backgroundColor: 'var(--dark-green-color)', borderColor: 'var(--dark-green-color)' }}
                        onClick={() => download()}
                        disabled={ingLoading}
                    />
                </div>
            </div>
            {ingLoading && initialFeedData ? (
                <div className="flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                    <span className="ml-2">Loading Feed Form...</span>
                </div>
            ) : (
                <FeedForm 
                    ref={feedFormRef}
                    initialFeedData={initialFeedData}
                    ingredients={ingredients}
                    existingFeedNames={existingFeedNames}
                    setFeedNameExists={(e) => setFeedNameExists(e)}
                    saveLoading={saveLoading}
                    onSave={saveFeed}
                    setFormulationResult={setFormulationResult}
                    selectedUnit={selectedUnit}
                    onMessage={handleMessage}
                    setDownloadCSVData={setDownloadCSVData}
                />
            )}
        </div>
    );
};

export default AddFeed;
