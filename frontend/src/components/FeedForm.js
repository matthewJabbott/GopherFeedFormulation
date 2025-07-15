import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { generateFeed } from '../utils/generateFeed';
import { InputNumber } from 'primereact/inputnumber';
import { FeedResultTable, FeedSummaryResultTable } from '../components/FeedResults';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';

export const FeedForm = forwardRef(({
    initialFeedData,
    ingredients,
    existingFeedNames,
    setFeedNameExists,
    saveLoading,
    onSave,
    setFormulationResult,
    selectedUnit,
    onMessage,
    setDownloadCSVData
}, ref) => {

    const [searchIngredient, setSearchIngredient] = useState("");
    const [feedName, setFeedName] = useState('');
    const [feedDescription, setFeedDescription] = useState('');
    const [ingredientCosts, setIngredientCosts] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [ingredientCarbonFootprints, setIngredientCarbonFootprints] = useState({});
    const [totalCarbonFootprint, setTotalCarbonFootprint] = useState(0);
    const [totalPercentage, setTotalPercentage] = useState(0);
    const [percentageError, setPercentageError] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [summaryResult, setSummaryResult] = useState({});
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientPercentages, setIngredientPercentages] = useState({});
    const [selectedFeedId, setSelectedFeedId] = useState(null);
    const [localFeedNameExists, setLocalFeedNameExists] = useState(false);
    const [localFormulationResult, setLocalFormulationResult] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (initialFeedData && ingredients.length > 0) {
            setFeedName(initialFeedData.feed_name);
            setFeedDescription(initialFeedData.feed_description);
            setSelectedFeedId(initialFeedData.feed_id);
    
            // Create a map for quick lookup of ingredients by ingredient_id
            const ingredientsMap = ingredients.reduce((acc, ingredient) => {
                acc[ingredient.id] = ingredient;
                return acc;
            }, {});

            // Match selected ingredients with their full details from ingredients list
            const selected = initialFeedData.ingredients.map(ingredient => {
                const fullIngredient = ingredientsMap[ingredient.ingredient_id];
    
                if (fullIngredient) {
                    return {
                        id: ingredient.ingredient_id,
                        Name: ingredient.ingredient_name,
                        ...fullIngredient, // Add all nutritional values and other details
                        percentage: ingredient.percentage // Override percentage
                    };
                }
                return null;
            }).filter(ingredient => ingredient !== null); // Filter out nulls (in case some ingredients are not found)
    
            const percentages = {};
            initialFeedData.ingredients.forEach(ingredient => {
                percentages[ingredient.ingredient_id] = ingredient.percentage;
            });
    
            setSelectedIngredients(selected);
            setIngredientPercentages(percentages);
        }
    }, [initialFeedData]);

    // Update the useEffect to use both local state and prop setter
    useEffect(() => {
        if (feedName) {
            const exists = existingFeedNames.includes(feedName);
            setLocalFeedNameExists(exists);
            setFeedNameExists(exists); // This is the prop setter from AddFeed.js
        } else {
            setLocalFeedNameExists(false);
            setFeedNameExists(false);
        }
    }, [feedName, existingFeedNames, setFeedNameExists]);

    // This function updates the percentage value for a specific ingredient (by its id) in 
    // the ingredientPercentages state.
    const handlePercentageChange = (id, value) => {
        setIngredientPercentages((prev) => {
            const updated = { ...prev, [id]: value };
            return updated;
        });
    };

    // This function is used to add the percentage input field to the ingredients table
    // which let users enter a percentage for each ingredient.
    const percentageBodyTemplate = (rowData) => (
        <InputNumber
            value={ingredientPercentages[rowData.id] || null}
            minFractionDigits={2}
            maxFractionDigits={2}
            aria-label={`percentage-${rowData.id}`}
            mode="decimal"
            max={100.50}
            min={0}
            onChange={(e) => {
                let rawValue = e.value;
                let clampedValue = rawValue;
                if (rawValue > 100.50) {
                    clampedValue = 100.5;
                }
                handlePercentageChange(rowData.id, clampedValue);
            }}
            inputId={`percentage-${rowData.id}`}
            inputStyle={{ width: '4rem' }}
            className="p-inputtext-sm"
        />

    );

    const costBodyTemplate = (rowData) => (
        <InputNumber
            value={ingredientCosts[rowData.id] || null}
            placeholder="optional"
            min={0}
            onChange={(e) => {
                let rawValue = e.value;
                let clampedValue = rawValue;
                if (rawValue > 99999.99) {
                    clampedValue = 99999.99;
                }
                handleCostChange(rowData.id, clampedValue);
            }}
            maxFractionDigits={2}
            minFractionDigits={2}
            inputStyle={{ width: '4.7rem' }}
            className="p-inputtext-sm"
            aria-label={`cost-${rowData.id}`}
            mode="decimal"
            max={99999.99}
        />
    );

    const carbonFootprintBodyTemplate = (rowData) => (
        <InputNumber
            value={ingredientCarbonFootprints[rowData.id] || null}
            placeholder="optional"
            onChange={(e) => {
                let rawValue = e.value;
                let clampedValue = rawValue;
                if (rawValue > 99999.99) {
                    clampedValue = 99999.99;
                }
                setIngredientCarbonFootprints((prev) => ({
                    ...prev,
                    [rowData.id]: clampedValue
                }));
            }}
            maxFractionDigits={2}
            minFractionDigits={2}
            inputStyle={{ width: '4.7rem' }}
            className="p-inputtext-sm"
            aria-label={`carbon-footprint-${rowData.id}`}
            mode="decimal"
            max={99999.99}
            min={0}
        />
    );

    const handleCostChange = (id, value) => {
        setIngredientCosts((prev) => ({
            ...prev,
            [id]: value,
        }));
    };
    
    // This function filters the sorted ingredients list based on the searchIngredient and ensure
    // selected ingredients are always at the top of the list.
    const selectedIds = new Set(selectedIngredients.map(p => p.id));
    const filteredIngredients = [
        ...selectedIngredients,
        ...ingredients.filter(p =>
            !selectedIds.has(p.id) &&
            (p.Name.toLowerCase().includes(searchIngredient.toLowerCase()))
        )
    ];

    // This function checks the total percentage of the selected ingredients and returns 
    // total and isValid
    const checkPercentage = (ingredients, percentages) => {
        const total = ingredients.reduce((acc, product) => {
            const val = parseFloat(percentages[product.id]);
            return acc + (isNaN(val) ? 0 : val);
        }, 0);
    
        const isValid = total >= 99.5 && total <= 100.5;
    
        return { total, isValid };
    };
    
    // This function is used to generate Feeds with the selected ingredients and their percentages
    // And it sets the formulationResult and summaryResult states
    const generateFeedWithIngreNPercent = (selectedIngredients, ingredientPercentages, selectedUnit) => {
        const selectedIngredientsWithPercentages = selectedIngredients.map(ingredient => ({
            ...ingredient,
            percentage: parseFloat(ingredientPercentages[ingredient.id])
        })).filter(ingredient => ingredient.percentage > 0.00);

        const output = generateFeed(selectedIngredientsWithPercentages);
        setFormulationResult(output);
        setLocalFormulationResult(output);
        setShowResult(true);

        if (selectedUnit === '%') {
            setFormulationResult((prev) => {  
                const newResult = { ...prev };
                for (const key in newResult) {
                    if (newResult.hasOwnProperty(key)) {
                        newResult[key] = newResult[key].map(value => value / 10);
                    }
                }
                return newResult;
            });
            setLocalFormulationResult((prev) => {  
                const newResult = { ...prev };
                for (const key in newResult) {
                    if (newResult.hasOwnProperty(key)) {
                        newResult[key] = newResult[key].map(value => value / 10);
                    }
                }
                return newResult;
            });

        }
            
        const summary = Object.fromEntries(
            Object.entries(output)
                .slice(1, 10)
                .map(([key, value]) => [key, value.slice(0, 2)])
            );
        setSummaryResult(summary);

        if (selectedUnit === '%') {
            setSummaryResult((prev) => {  
                const newResult = { ...prev };
                for (const key in newResult) {
                    if (newResult.hasOwnProperty(key)) {
                        newResult[key] = newResult[key].map(value => value / 10);
                    }
                }
                return newResult;
            });
        }
        
    }

    useEffect(() => {
        const total = selectedIngredients.reduce((acc, ingredient) => {
            const percentage = parseFloat(ingredientPercentages[ingredient.id]) || 0;
            const cost = parseFloat(ingredientCosts[ingredient.id]) || 0;
            return acc + (percentage * cost) / 100;
        }, 0);
        setTotalCost(total);
    }, [selectedIngredients, ingredientPercentages, ingredientCosts]);
    
    useEffect(() => {
        const totalCF = selectedIngredients.reduce((acc, ingredient) => {
            const percentage = parseFloat(ingredientPercentages[ingredient.id]) || 0;
            const carbonFootprint = parseFloat(ingredientCarbonFootprints[ingredient.id]) || 0;
            return acc + (percentage * carbonFootprint) / 100;
        }, 0);
        setTotalCarbonFootprint(totalCF);
    }, [selectedIngredients, ingredientPercentages, ingredientCarbonFootprints]);
    
    // This gets triggered when species is selected or when selected ingredients or percentages change
    // It checks the total percentage and if it is valid, it generates the feed
    useEffect(() => {
        var { total, isValid } = checkPercentage(selectedIngredients, ingredientPercentages);
        setTotalPercentage(total);
        setPercentageError(!isValid);

        if (isValid) {
            generateFeedWithIngreNPercent(selectedIngredients, ingredientPercentages, selectedUnit);
        }

    }, [selectedIngredients, ingredientPercentages, selectedUnit]);

    // Update downloadCSVData when ingredients or percentages change
    useEffect(() => {
        if (selectedIngredients.length > 0) {
            const ingredientData = selectedIngredients.map(ingredient => ({
                id: ingredient.id,
                Name: ingredient.Name,
                percentage: ingredientPercentages[ingredient.id] || 0
            })).filter(item => item.percentage > 0);

            setDownloadCSVData(prev => ({
                ...prev,
                feedName: feedName,
                ingredientPercentages: ingredientData
            }));
        }
    }, [selectedIngredients, ingredientPercentages, feedName, setDownloadCSVData]);

    // This function saves the feed and validate each field
    const saveFeed = async () => {
        const feedName = document.getElementById("feed_name");
        const feedDescription = document.getElementById("feed_description");
        const totalPercentage = document.getElementById("total_percentage");

        if (!feedName.value) {
            feedName.classList.add("p-invalid");
            feedName.scrollIntoView({ behavior: 'smooth', block: 'center' });
            onMessage({ success: false, severity: 'error', message: 'Please fill in the Feed Name field.' });
            return;
        } else if (localFeedNameExists && !selectedFeedId) {
            feedName.classList.add("p-invalid");
            feedName.scrollIntoView({ behavior: 'smooth', block: 'center' });
            onMessage({ success: false, severity: 'error', message: 'Feed name already exists.' });
            return;
        } else {
            feedName.classList.remove("p-invalid");
        }

        if (!feedDescription.value) {
            feedDescription.classList.add("p-invalid");
            feedDescription.scrollIntoView({ behavior: 'smooth', block: 'center' });
            onMessage({ success: false, severity: 'error', message: 'Please fill in the Feed Description field.' });
            return;
        } else {
            feedDescription.classList.remove("p-invalid");
        }

        const { isValid } = checkPercentage(selectedIngredients, ingredientPercentages);
        if (!isValid) {
            totalPercentage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            onMessage({ success: false, severity: 'error', message: 'Please check the percentages.' });
            return;
        }

        // Format ingredients as an object with id: percentage
        const ingredientsObject = {};
        const filteredSelectedIngredients = selectedIngredients.filter((ingredient) => {
            const percentage = ingredientPercentages[ingredient.id] || 0.00;
            if (percentage > 0) {
                ingredientsObject[ingredient.id] = percentage;
                return true;
            }
            return false; 
        });
        setSelectedIngredients(filteredSelectedIngredients);
        const feedData = {
            name: feedName.value,
            feed_description: feedDescription.value,
            species_id: null,
            weight_cat_id: null,
            ingredients: ingredientsObject
        };
        onSave(feedData);
    };

    // Expose checkDownloadCSV through the ref
    useImperativeHandle(ref, () => ({
        checkDownloadCSV: () => {
            const { isValid } = checkPercentage(selectedIngredients, ingredientPercentages);
            return isValid;
        }
    }));

    return (
        <div>
            <div className="py-2">
                <Accordion activeIndex={0}>
                    <AccordionTab header="General Information" style={{ backgroundColor: "rgba(0, 20, 0, 0.1)", color: "black" }}>
                        <div className="p-2">
                            <div className="formgrid grid">
                                <div className="field col flex flex-column">
                                    <label id="label-feed_name" className="text-sm">Feed Name *</label>
                                    <InputText 
                                        id="feed_name" 
                                        maxLength={40} 
                                        required 
                                        value={feedName}
                                        onChange={(e) => { 
                                            const val = e.target.value.slice(0, 40);
                                            setFeedName(val);
                                        }}
                                        className={localFeedNameExists ? 'p-invalid' : ''}
                                        aria-labelledby={`label-feed_name`}
                                    />
                                    {localFeedNameExists ? (
                                        <small className="p-error">Feed name already exists.</small>
                                    ) : null}
                                </div>
                                <div className="field col flex flex-column">
                                    <label htmlFor="feed_description" className="text-sm">Feed Description *</label>
                                    <InputText 
                                        id="feed_description" 
                                        maxLength={100} 
                                        value={feedDescription}
                                        onChange={(e) => { 
                                            const val = e.target.value.slice(0, 100);
                                            setFeedDescription(val); 
                                        }}
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>

            <div className="grid py-2">
                <div className="field col flex flex-column">
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Add Ingredient" style={{ backgroundColor: "rgba(0, 20, 0, 0.1)", color: "black" }}>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <div>
                                    <InputText
                                        placeholder="Search by code or name..."
                                        value={searchIngredient}
                                        onChange={(e) => setSearchIngredient(e.target.value)}
                                        className="p-inputtext-sm md:w-15rem"
                                    />
                                </div>
                                <div className="flex flex-column align-items-end text-right">
                                    <p>Formulation: {totalPercentage.toFixed(2)}%</p>
                                    {percentageError && (
                                        <p style={{ color: 'red', fontSize: '0.9rem' }} id="total_percentage">
                                            Formulation total must be between 99.5% and 100.5%.
                                        </p>
                                    )}
                                </div>     
                            </div>
                            <DataTable
                                value={filteredIngredients}
                                selectionMode="checkbox"
                                selection={selectedIngredients}
                                onSelectionChange={(e) => setSelectedIngredients(e.value)}
                                paginator
                                rows={7}
                                dataKey="id"
                                responsiveLayout="scroll"
                                className="p-datatable-sm"
                                style={{ minWidth: '30rem' }}
                                removableSort
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                <Column field="Name" header="Name" sortable />
                                <Column field="percentage" header="%" body={percentageBodyTemplate} />
                                <Column field="cost" header="Cost ($/kg)" body={costBodyTemplate} />
                                <Column field="carbon_footprint" header="CO₂eq/t" body={carbonFootprintBodyTemplate} />
                            </DataTable>
                        </AccordionTab>
                    </Accordion>
                </div>

                <div className="field col flex flex-column">
                    <FeedSummaryResultTable result={summaryResult} totalCost={totalCost} totalCarbonFootprint={totalCarbonFootprint} />
                </div>
            </div>

            { showResult && (
                <><div>
                    <h2 className='text-xl md:text-2xl font-semibold'>Result</h2>
                    <FeedResultTable formulationResult={localFormulationResult} />
                </div>
                <div className="flex justify-content-end mt-4">
                    <Button
                        label={localFeedNameExists && selectedFeedId ? "Update Feed" : "Add New Feed"}
                        className="mr-3"
                        loading={saveLoading}
                        style={{ backgroundColor: 'var(--dark-green-color)', borderColor: 'var(--dark-green-color)' }}
                        onClick={() => saveFeed()} />
                    <Button label="Cancel" severity="secondary" text onClick={() => navigate("/view-feeds")} />
                </div></>
            )}
        </div>
    )
})