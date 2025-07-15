import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { useAuth, useUser } from '@clerk/clerk-react';
import '../styles/viewIngredients.css';
import {
  deleteIngredient,
  getIngredientByUserId,
} from '../services/ingredientService';
import { useNavigate } from 'react-router';

const sortOrderKeys = {
  ASC: 'ASC',
  DESC: 'DESC',
};
const ViewIngredientsPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [pagination, setPagination] = useState({ first: 0, rows: 20 });
  const [totalRecords, setTotalRecords] = useState(0);

  const [ingredients, setIngredients] = useState([]);
  const [nutritionKeys, setNutritionKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [sortField, setSortField] = useState("Name");
  const [sortOrder, setSortOrder] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const actionMenu = useRef(null);
  const toast = useRef(null);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData({
      search: searchValue,
      sortBy: sortField,
      sortOrder: sortOrder === 1 ? sortOrderKeys.ASC : sortOrderKeys.DESC,
      itemsPerPage: pagination.rows,
      page: pagination.first / pagination.rows + 1,
    });
  }, []);

  const fetchData = async ({
    search = '',
    sortBy = 'Name',
    sortOrder = sortOrderKeys.ASC,
    itemsPerPage = 20,
    page = 1
  } = {}) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await getIngredientByUserId(token, page, itemsPerPage, search, sortBy, sortOrder);
      const { data, totalItems } = response;

      if (data.length > 0) {
        const keys = Object.keys(data[0]);
        const nutritionFields = keys.filter(
          (key, idx) => idx >= 3 && key !== 'isCore' && key !== 'clerk_id'
        );
        setNutritionKeys(nutritionFields);
      }
      setIngredients(data);
      setTotalRecords(totalItems || 0);
    } catch (error) {
      console.error('Failed to load ingredients:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch ingredients.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setPagination((prev) => ({ ...prev, first: 0 }));
    fetchData({
      search: value,
      sortBy: sortField,
      sortOrder: sortOrder === 1 ? sortOrderKeys.ASC : sortOrderKeys.DESC,
      itemsPerPage: pagination.rows,
      page: 1,
    });
  };

  const onPageChange = (e) => {
    setPagination({ first: e.first, rows: e.rows });
    fetchData({
      search: searchValue,
      sortBy: sortField,
      sortOrder: sortOrder === 1 ? sortOrderKeys.ASC : sortOrderKeys.DESC,
      itemsPerPage: e.rows,
      page: e.first / e.rows + 1,
    });
  };

  const onSortChange = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
    fetchData({
      search: searchValue,
      sortBy: e.sortField,
      sortOrder: e.sortOrder === 1 ? sortOrderKeys.ASC : sortOrderKeys.DESC,
      itemsPerPage: pagination.rows,
      page: pagination.first / pagination.rows + 1,
    });
  };

  const handleDeleteClick = () => {
    setDeleteDialogVisible(true);
  };

  const handledeleteIngredient = async () => {
    const token = await getToken();

    const deletionPromises = selectedRows.map(async (row) => {
      try {
        await deleteIngredient(token, row.id);
        toast.current.show({
          severity: 'success',
          summary: 'Deleted',
          detail: `Deleted: ${row.Name}`,
        });
      } catch (error) {
        console.error(`Failed to delete ingredient "${row.Name}":`, error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: (
            <>
              Failed to delete: {row.Name}
              <br />
              <br />
              {error?.response?.data?.message}
            </>
          ),
        });
      }
    });

    await Promise.allSettled(deletionPromises);
    fetchData();
    setDeleteDialogVisible(false);
    setSelectedRows([]);
  };

  const rowClass = (data) => {
    return {
      'data-table__row-not-original': data.isCore === 1
    };
  };

  const actionItems = [
    {
      label: 'Delete Ingredient',
      icon: 'pi pi-trash',
      disabled: !selectedRows.length,
      command: handleDeleteClick,
    },
  ];

  return (
    <div className='p-4'>
      <Toast ref={toast} position='top-right' />

      <h1 className='mb-4'>Ingredients</h1>

      <div className='flex flex-wrap align-items-center justify-content-between mb-3'>
        <div className='flex gap-3'>
          <InputText
            value={searchValue}
            onChange={onSearch}
            placeholder='Search Ingredients'
            className='w-20rem search-input'
          />
        </div>
        
        <div className='flex align-items-center gap-3 px-3 py-2' style={{ border: "1px solid rgb(211, 211, 211)", borderRadius: "4px" }}        >
          <span className='text-sm font-semibold'>Core Ingredients: </span><span style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'rgb(227, 255, 227)',
            border: '1px solid rgb(0, 128, 0)',
          }}></span>
        </div>

        <div className='flex align-items-center gap-3'>
          <Button
            label='Add Ingredient'
            icon='pi pi-plus'
            className='text-white unified-button'
            disabled={selectedRows.length > 1}
            onClick={() => {
              const query = selectedRows.length
                ? `?originalIngredient=${selectedRows[0]?.id}`
                : '';              
              navigate(`/add-ingredient${query}`, {
                state: { 
                  originalIngredient: selectedRows[0] || undefined },
              });
            }}
          />
          <Button
            icon='pi pi-ellipsis-v'
            className='p-button-text'
            style={{ height: '2.5rem' }}
            onClick={(e) => actionMenu.current.toggle(e)}
            aria-haspopup
          />
          <Menu model={actionItems} popup ref={actionMenu} />
        </div>
      </div>

      <DataTable 
        value={ingredients}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey='id'
        rowClassName={rowClass}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSortChange}
        loading={isLoading}
        lazy
        scrollable
        scrollHeight='flex'
        paginator
        first={pagination.first}
        rows={pagination.rows}
        totalRecords={totalRecords}
        onPage={(e) => onPageChange(e)}
        rowsPerPageOptions={[10, 20, 50, 100]}
      >
        <Column selectionMode='multiple' frozen headerStyle={{ width: '3rem' }} />
        <Column field='Name' header='Name' frozen sortable style={{ minWidth: '200px' }} />
        {nutritionKeys.map((key) => (
          <Column
            key={key}
            field={key}
            header={key.replace(/_/g, ' ')}
            style={{ minWidth: '100px' }}
          />
        ))}
      </DataTable>

      <Dialog
        header='Do you want to permanently delete this?'
        visible={deleteDialogVisible}
        style={{ width: '30vw' }}
        onHide={() => setDeleteDialogVisible(false)}
        footer={
          <>
            <Button
              label='Close'
              className='p-button-secondary'
              onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
              label='Confirm'
              className='p-button-danger'
              onClick={handledeleteIngredient}
            />
          </>
        }
      >
      </Dialog>
    </div>
  );
};

export default ViewIngredientsPage;
