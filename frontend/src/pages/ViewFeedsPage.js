import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { fetchAllFeeds, fetchFeedById, deleteFeedService} from '../services/feedService';
import { fetchAllIngredients } from '../services/ingredientService';
import { downloadMultipleCSV } from '../utils/downloadMultipleCSV';
import { useUserRole } from '../utils/UserRole';

const ViewFeedsPage = () => {
  const [filteredFeeds, setFilteredFeeds] = useState([]);
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const [showTip, setShowTip] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0); // Added state for total records
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]); // State to hold ingredients data
  const { role } = useUserRole();

  const toast = useRef(null);
  const moreMenu = useRef(null);

  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    sortField: 'feed_name', // Default sort
    sortOrder: 1,
    globalSearch: "",
  });

    const loadFeeds = async (lazyParams) => {
    try {
        setLoading(true);
        const token = await getToken();
        let response;
        if (role === "Admin") {
            response = await fetchAllFeeds(
                token,
                lazyParams.first,
                lazyParams.rows,
                lazyParams.sortField,
                lazyParams.sortOrder === 1 ? 'ASC' : 'DESC',
                lazyParams.globalSearch
            );
        } else {
            response = await fetchFeedById(
                token,
                lazyParams.first,
                lazyParams.rows,
                lazyParams.sortField,
                lazyParams.sortOrder === 1 ? 'ASC' : 'DESC',
                lazyParams.globalSearch
            );
        }

      setFilteredFeeds(response.data);
      setTotalRecords(response.totalRecords);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load feeds:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch feeds.' });
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeds(lazyState);
  }, [lazyState]); // Whenever lazyState changes, reload feeds

  const loadIngredientData = useCallback(async () => {
    try {
      const token = await getToken();
      const result = await fetchAllIngredients(token);
      setIngredients(result.data);
    } catch (err) {
      console.error("Error:", err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch feeds.' });
    }
  }, [getToken]);   
  
  useEffect(() => {
      loadIngredientData();
  }, [loadIngredientData]);

  const onPage = (event) => {
    setLazyState((prevState) => ({
      ...prevState,
      first: event.first,
      rows: event.rows,
      page: event.page
    }));
  };

  const onSort = (event) => {
    setLazyState((prevState) => ({
      ...prevState,
      sortField: event.sortField,
      sortOrder: event.sortOrder
    }));
  };

  const handleSearch = (e) => {
    setLazyState((prevState) => ({
      ...prevState,
      globalSearch: e.target.value
    }));
  };  

  const handleDelete = async () => {
    if (selectedFeeds.length === 0) return;
  
    try {
      const token = await getToken();
      for (const feed of selectedFeeds) {
        await deleteFeedService(feed.feed_id, token);
      }
  
      toast.current.show({
        severity: 'success',
        summary: 'Deleted',
        detail: `Successfully deleted ${selectedFeeds.length} feed(s).`,
      });
  
      setSelectedFeeds([]);
      loadFeeds(lazyState);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete feed(s).',
      });
    }
  };

  const confirmDelete = () => {
    confirmDialog({
      message: `Are you sure you want to delete the selected feed(s)?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: handleDelete,
      acceptClassName: 'p-button-danger',
    });
  };
  

  const moreItems = [
    {
      label: 'Delete Feed',
      icon: 'pi pi-trash',
      command: confirmDelete,
      disabled: selectedFeeds.length === 0,
    },

    {
      label: 'Download CSV',
      icon: 'pi pi-download',
      command: () => {
        const feeds = [];
        selectedFeeds.forEach(feed => {
          const matchedIngredients = feed.ingredients.map(feedIng => {
            const fullIngredient = ingredients.find(ing => ing.id === feedIng.ingredient_id);
            return {
              ...fullIngredient,
              percentage: feedIng.percentage,
            };
          });
      
          const feedData = {
            feedName: feed.feed_name,
            creationDate: new Date(feed.created_at).toISOString().split('T')[0],
            ingredientPercentages: matchedIngredients
          };
          feeds.push(feedData);              
        });
      
        downloadMultipleCSV(feeds);
      },      
      disabled: selectedFeeds.length === 0,
    }
    
  ];

  return (
    <div className="p-5">
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />
      {/* Header and Message */}
      <div className="flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <h2 className="text-4xl font-bold m-0">Feeds</h2>

        {showTip && (
          <Message
            severity="info"
            style={{
              backgroundColor: '#e6f4fa',
              border: '1px solid #b6e0f2',
              color: '#0c5460',
              borderRadius: '8px',
              padding: '1rem',
              maxWidth: '700px',
            }}
            content={
              <div className="flex justify-content-between align-items-start w-full">
                <span className="mr-3">
                  To view more about a feed, please <b>select One Checkbox</b> from the feed table and <b>click on "View Feed"</b> button.
                </span>
                <Button
                  icon="pi pi-times"
                  className="p-button-text p-button-sm"
                  onClick={() => setShowTip(false)}
                  style={{ color: '#0c5460' }}
                />
              </div>
            }
          />
        )}
      </div>

      {/* Search and Actions */}
      <div className="flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <InputText
          placeholder="Search Feeds"
          value={lazyState.globalSearch}
          onChange={handleSearch}
          className="border-round-xl text-sm search-input"
        />

        <div className="flex gap-2 align-items-center">
          {(selectedFeeds.length === 0 || selectedFeeds.length === 1) && (
            <Button
              label={selectedFeeds.length === 1 ? "View Feed" : "Add Feed"}
              icon={selectedFeeds.length === 1 ? "pi pi-eye" : "pi pi-plus"}
              className='text-white unified-button'
              onClick={() => {
                if (selectedFeeds.length === 1) {
                  navigate(`/add-feed?originalFeed=${selectedFeeds[0].feed_id}`, {
                    state: { selectedFeeds }
                  });
                } else {
                  navigate('/add-feed');
                }
              }}
            />
          )}
          {selectedFeeds.length > 1 && (
            <Button
              label="View Feed"
              icon="pi pi-eye"
              className='text-white unified-button'
              disabled
            />
          )}

          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-text"
            style={{ height: '2.5rem' }}
            onClick={(e) => moreMenu.current.toggle(e)}
            aria-haspopup
          />
          <Menu model={moreItems} popup ref={moreMenu} />
        </div>
      </div>

      {/* Table */}
      <DataTable
        value={filteredFeeds}
        paginator
        lazy
        loading={loading}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        first={lazyState.first}
        sortField={lazyState.sortField}
        sortOrder={lazyState.sortOrder}
        onPage={onPage}
        onSort={onSort}
        selection={selectedFeeds}
        onSelectionChange={(e) => setSelectedFeeds(e.value)}
        dataKey="feed_id"
        className="shadow-2"
        tableStyle={{ minWidth: '50rem' }}
        rowsPerPageOptions={[10, 20, 35, 50]}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="feed_name" header="Name" sortable />
        <Column field="feed_description" header="Description" sortable />
        <Column
          field="species"
          header="Species"
          body={(rowData) => {
            if (rowData.species) {
              return `${rowData.species}`;
            } else {
              return 'N/A';
            }
          }}
          sortable
        />
        <Column
          field="ingredients"
          header="Ingredients"
          body={(rowData) =>
            Array.isArray(rowData.ingredients)
              ? rowData.ingredients.map(ing => `${ing.ingredient_name} (${ing.percentage}%)`).join(', ')
              : 'No ingredients'
          }
        />
        { role === "Admin" ? (
            <Column
                field="created_by"
                header="Created By"
                body={(rowData) => rowData.created_by || 'N/A'}
                sortable
            />
        ) : null }
        <Column
          field="created_at"
          header="Created At"
          body={(rowData) =>
            new Date(rowData.created_at).toISOString().split('T')[0]
          }
          sortable
        />
      </DataTable>
    </div>
  );
};

export default ViewFeedsPage;