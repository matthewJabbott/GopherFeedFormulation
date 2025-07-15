// ChartsVisualization.js
import React, { useEffect, useState, useRef } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { getFeedsPerSpecies, getIngredientUsage } from '../services/dashboardService';
import { useAuth } from '@clerk/clerk-react';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const ChartsVisualization = ( {toastRef} ) => {
  // State variables for the four endpoints
  const [feedsPerSpecies, setFeedsPerSpecies] = useState([]);
  const [ingredientUsage, setIngredientUsage] = useState([]);
  const { getToken } = useAuth();

  const fetchFeedsPerSpecies = async () => {
    const token = await getToken();
    try {
      const feedsPerSpecies = await getFeedsPerSpecies(token);
      setFeedsPerSpecies(feedsPerSpecies);
    } catch (error) {
      console.error('Error fetching feeds per species:', error);
      toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch feeds per species' });
    }
  };

  const fetchIngredientUsage = async () => {
    const token = await getToken(); 
    try {
      const ingredientUsage = await getIngredientUsage(token);
      setIngredientUsage(ingredientUsage);
    } catch (error) {
      console.error('Error fetching ingredient usage:', error);
      toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch ingredient usage' });
    }
  };

  // Fetch data from all endpoints on component 
  useEffect(() => {
    fetchFeedsPerSpecies();
    fetchIngredientUsage();
  }, []);

  // Prepare data for the "Feeds per Species" bar chart
  const feedsPerSpeciesData = {
    labels: feedsPerSpecies.map(item => item.species),
    datasets: [{
      label: 'Feeds Count',
      data: feedsPerSpecies.map(item => item.feedCount),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  // Prepare data for the "Ingredient Usage" pie chart
  const ingredientUsageData = {
    labels: ingredientUsage.map(item => item.Name),
    datasets: [{
      label: 'Usage Count',
      data: ingredientUsage.map(item => item.usageCount),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
    }]
  };

  return (
    <div className="px-4">

      {/* Feeds Per Species Chart */}
      <section className="py-2">
        <h3 className="text-xl font-medium mb-4 text-center">Feeds Per Species</h3>
        {feedsPerSpecies.length > 0 ? (
          <div style={{ height: '400px' }}>
            <Bar data={feedsPerSpeciesData} options={{ maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className='text-center font-italic'>No data available for feeds per species.</p>
        )}
      </section>

      {/* Ingredient Usage Chart */}
      <section className="py-2">
        <h3 className="text-xl font-medium mb-4 text-center ">Ingredient Usage</h3>
        {ingredientUsage.length > 0 ? (
          <div style={{ height: '400px' }}>
            <Pie data={ingredientUsageData} options={{ maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className='text-center font-italic'>No data available for ingredient usage.</p>
        )}
      </section>

    </div>
  );
};

export default ChartsVisualization;  