import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuth } from '@clerk/clerk-react';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { getLogs } from '../services/logService';
import dayjs from 'dayjs'; 

const Logs = () => {
  const { getToken } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = React.useRef(null);

  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 20,
    page: 0,
    sortField: null,
    sortOrder: null,
    filters: {
      timestamp: { value: null, matchMode: FilterMatchMode.CONTAINS },
      username: { value: null, matchMode: FilterMatchMode.CONTAINS },
      email: { value: null, matchMode: FilterMatchMode.CONTAINS },
      description: { value: null, matchMode: FilterMatchMode.CONTAINS },
      category: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ip_address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const token = await getToken();
        setLoading(true);
  
        const response = await getLogs(token, lazyParams);
        if (!response || !response.success) throw new Error('Failed to fetch logs');
  
        setLogs(response.data.logs);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to fetch logs: ${error.message}`,
          life: 5000
        });
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
  
    loadLogs();
  }, [lazyParams, getToken]);

  const onPage = (event) => {
    setLazyParams({ ...lazyParams, first: event.first, rows: event.rows, page: event.page });
  };
  
  const onSort = (event) => {
    setLazyParams({ ...lazyParams, sortField: event.sortField, sortOrder: event.sortOrder });
  };
  
  const onFilter = (event) => {
    setLazyParams({ ...lazyParams, filters: event.filters });
  };
  
  return (
    <div className="w-full bg-gray-50 px-4 pt-3 pb-5">
      <Toast ref={toast} />
      <div className="flex flex-wrap justify-content-between align-items-center py-3">
        <h2>System Activity Logs</h2>
      </div>
      <div>
      <DataTable
        value={logs}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        loading={loading}
        onPage={onPage}
        onSort={onSort}
        onFilter={onFilter}
        filters={lazyParams.filters}
        sortField={lazyParams.sortField}
        sortOrder={lazyParams.sortOrder}
        filterDisplay="menu"
        rowsPerPageOptions={[20, 40, 60, 100]}
      >
        <Column 
          field="timestamp" header="Timestamp" 
          sortable filter 
          body={(rowData) => dayjs(rowData.timestamp).format('YYYY-MM-DD, hh:mmA')} 
          style={{ minWidth: '230px'}}
        />
        <Column field="username" header="Username" sortable filter />
        <Column field="email" header="Email" sortable filter />
        <Column field="category" header="Category" sortable filter />
        <Column field="description" header="Description" sortable filter />
        <Column field="ip_address" header="IP Address" sortable filter />
      </DataTable>
      </div>
    </div>
  );
};

export default Logs;