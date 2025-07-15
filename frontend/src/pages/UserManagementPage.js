import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getUsers, addUser, updateUser, deleteUser } from '../services/userService'
import { useAuth } from '@clerk/clerk-react';
import { Toast } from 'primereact/toast';
import { useUser } from '@clerk/clerk-react';
import UserForm from '../components/UserForm';

const UserManagement = () => {

  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [emailLoading, setEmailLoading] = useState(true);
  const [addUserDialogVisible, setAddUserDialogVisible] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);
  const [saveUserLoading, setSaveUserLoading] = useState(false);

  const { getToken } = useAuth();
  const toast = useRef(null);

  const roleOptions = ['Admin', 'Member', 'Guest'];

  const handleRoleChange = async (e, user) => {
    const updatedRole = e.value;
    const token = await getToken();
    const userData = {
      id: user.clerkId,
      role: updatedRole,
    }

    try {
      const response = await updateUser(token, userData);
      if (response && response.success) {
        const updatedUsers = users.map(u =>
          u.clerkId === user.clerkId ? { ...u, role: updatedRole } : u
        );
        setUsers(updatedUsers);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: `User role updated to ${updatedRole}`,
          life: 3000
        });
      } else {
        throw new Error(response?.message || "Unknown error occurred.");
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Failed to update user role.',
        detail: error.message,
        life: 3000
      });
    } 
  };

  const handleDeleteUser = (userId) => {
    confirmDialog({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        const token = await getToken();
        try {
          const response = await deleteUser(token, userId);
          if (response && response.success) {
            const updatedUsers = users.filter(user => user.clerkId !== userId);
            setUsers(updatedUsers);
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: `User deleted successfully.`,
              life: 3000
            });
          } else {
            throw new Error(response?.message || "Unknown error occurred.");
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.current.show({
            severity: 'error',
            summary: 'Failed to delete user.',
            detail: error,
            life: 3000
          });
        }
      },
    });
  };

  const fetchUsers = async () => {
    setUsernameLoading(true);
    setEmailLoading(true);
    const token = await getToken();
    console.log('Tokensdfsdfds');
    try {
      console.log('Fetching users...');
      const response = await getUsers(token);
      if (response && response.success) {
        setExistingUsers(response.data);
        const formattedUsers = response.data.map(u => ({
          clerkId: u.clerk_id,
          userId: u.id,
          username: `${u.username}`,
          email: u.email,
          role: u.role,
          created: u.created_at?.split('T')[0] ?? 'N/A',
          lastSignedIn: u.updated_at?.split('T')[0] ?? 'N/A',
          ip: 'N/A',
        })).filter(u => u.clerkId !== user.id);
        setUsers(formattedUsers);
      } else {
        throw new Error(response?.message || "Unknown error occurred.");
      } 
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Failed to fetch users.',
        detail: error.message,
        life: 3000
      });
    } finally {
      setUsernameLoading(false);
      setEmailLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteButtonTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-square p-button-danger p-button-sm"
        onClick={() => handleDeleteUser(rowData.clerkId)}
        tooltip="Delete User"
        tooltipOptions={{ position: 'top' }}
      />
    );
  };

  const handleAddUser = async (newUserData) => {
    const token = await getToken();
    setSaveUserLoading(true);
    try {
      const response = await addUser(token, newUserData);
      if (response && response.success) {        
        const created = new Date().toISOString().split('T')[0];
        const userToAdd = {
          ...newUserData,
          userId: 'N/A',
          clerkId: response.clerk_id,
          name: `${newUserData.first_name} ${newUserData.last_name}`,
          created,
          lastSignedIn: "N/A",
          role: 'Guest',
          ip: 'N/A',
        };
        setUsers([...users, userToAdd]);
        setAddUserDialogVisible(false);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
          life: 3000
        });
      } else {
        throw new Error(response?.message || "Unknown error occurred.");
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Failed to add user.',
        detail: error.message,
        life: 3000
      });
    } finally {
      setSaveUserLoading(false);
    }
  };

  const handleMessage = ({severity, summary, detail}) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000
    });
  };

  return (
    <div className="p-5 relative">
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />

      {/* Roles and Permissions Section */}
      <Dialog
        header="Roles and Permissions"
        visible={showRolesModal}
        style={{ width: '50vw' }}
        modal
        className="p-fluid"
        onHide={() => setShowRolesModal(false)}
      >
        <div className="flex justify-between gap-6">
          <div className="flex-1">
            <p><strong>Admin:</strong> Has full access to manage users, roles, and all other system settings.</p>
          </div>
          <div className="flex-1">
            <p><strong>Member:</strong> Can view and modify their own data, but cannot change roles or delete users.</p>
          </div>
          <div className="flex-1">
            <p><strong>Guest:</strong> Can log in and access is limited to the dashboard page only.</p>
          </div>
        </div>
      </Dialog>

      <div className="flex justify-content-between align-items-center mb-5">
        <h2 className="text-4xl font-bold m-0">User Management</h2>
        <div className="flex justify-content-between gap-3">
          <Button
            label="Add New User"
            icon="pi pi-user-plus"
            className=" p-button-sm unified-button"
            onClick={() => setAddUserDialogVisible(true)}
          />
          <Button
            label="Roles & Permissions"
            icon="pi pi-info-circle"
            className="p-button-primary p-button-sm"
            onClick={() => setShowRolesModal(true)}
          />
        </div>
      </div>

      <DataTable
        value={users}
        paginator
        rows={10}
        filterDisplay="menu"
        globalFilterFields={['name', 'email', 'role', 'clerkId', 'userId', 'ip']}
        emptyMessage="No users found."
        rowsPerPageOptions={[10, 20, 35, 50]}
        rowClassName={(rowData) => {
            return rowData.role === 'Guest' ? 'data-table__guest-row': ""
          }
        }
      >
        <Column field="clerkId" header="Clerk ID" sortable filter filterPlaceholder="Search by Clerk ID" style={{ minWidth: '200px' }} />
        <Column field="userId" header="User ID" sortable filter filterPlaceholder="Search by User ID" style={{ minWidth: '200px' }} />
        <Column field="username" header="User Name" sortable filter filterPlaceholder="Search by Name" style={{ minWidth: '200px' }} />
        <Column field="email" header="Email" sortable filter filterPlaceholder="Search by Email" style={{ minWidth: '200px' }} />
        <Column
          field="role"
          header="Role"
          sortable
          filter
          filterPlaceholder="Search by Role" style={{ minWidth: '200px' }}
          body={(rowData) => (
            <Dropdown
              value={rowData.role}
              options={roleOptions}
              onChange={(e) => handleRoleChange(e, rowData)}
              className="p-dropdown-sm"
            />
          )}
        />
        <Column field="lastSignedIn" header="Last Signed In" sortable filter filterPlaceholder="Search by Date" style={{ minWidth: '200px' }} />
        <Column field="created" header="Created At" sortable filter filterPlaceholder="Search by Date" style={{ minWidth: '200px' }} />
        <Column field="ip" header="IP Address" sortable filter filterPlaceholder="Search by IP" style={{ minWidth: '200px' }} />
        <Column body={deleteButtonTemplate} header="Actions" />
      </DataTable>

      <UserForm
        visible={addUserDialogVisible}
        onHide={() => setAddUserDialogVisible(false)}
        onAddUser={handleAddUser}
        users={existingUsers}
        usernameLoading={usernameLoading}
        emailLoading={emailLoading}
        saveUserLoading={saveUserLoading}
        onMessage={handleMessage}
      />
    </div>
  );
};

export default UserManagement;
