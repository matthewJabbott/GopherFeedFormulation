import { React, useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Chart } from 'primereact/chart';
import { useUserRole } from '../utils/UserRole';
import { getUsersCounts, getFeedsCounts, getIngredientCounts } from '../services/dashboardService';
import { useAuth } from '@clerk/clerk-react';
import { Toast } from 'primereact/toast';
import dashboardService from '../services/dashboardService';
import ChartsVisualization from '../components/ChartsVisualization';

const Dashboard = () => {
  const { user } = useUser();
  const { role, loading } = useUserRole();
  const isAdmin = role === 'Admin';
  const { getToken } = useAuth();
  const [usersCounts, setUsersCounts] = useState(0);
  const [feedsCounts, setFeedsCounts] = useState(0);
  const [ingredientCounts, setIngredientCounts] = useState(0);
  const toast = useRef(null);

  const adminFeatures = [
    { title: 'User Management', description: 'Manage all the user roles and accounts', link: '/user-management', disabled: false },
    { title: 'Log Features', description: 'View all the users\' activity and logs', link: '/logs', disabled: false },
    { title: 'Species Management', description: 'Manage and view all species data', disabled: false },
    { title: 'Admin Reports', description: 'Access insights and summaries of system use' },
  ];

  const coreFeatures = [
    { title: 'Ingredients', description: 'Manage all ingredients in the system', link: isAdmin ? '/view-ingredients-admin' : '/view-ingredients', disabled: false },
    { title: 'Feeds', description: 'Create and view feed formulations', link: '/view-feeds', disabled: false },
    { title: 'Advanced Feed Calculation', description: 'Create feed with species selection', disabled: false }
  ];

  const infoFeatures = [
    { title: 'About Us', description: 'Learn about our mission and team', link: "/about", disabled: false },
    { title: 'User Guide', description: 'Learn how to perform tasks', link: "/user-guide", disabled: false },
  ];

  const fetchUsersCounts = async () => { 
    const token = await getToken();
    try {
      const usersCounts = await getUsersCounts(token);
      setUsersCounts(usersCounts.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch user counts' });
    }
  }

  const fetchFeedsCounts = async () => {
    const token = await getToken();
    try {
      const feedsCounts = await getFeedsCounts(token);
      setFeedsCounts(feedsCounts.total);
    } catch (error) {
      console.error('Error fetching feeds:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch feed counts' });
    }
  }

  const fetchIngredientCounts = async () => {
    const token = await getToken();
    try {
      const ingredientCounts = await getIngredientCounts(token);
      setIngredientCounts(ingredientCounts.total);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch ingredient counts' });
    }
  }

  // Fetch data from all endpoints on component mount
  useEffect(() => {
    fetchUsersCounts();
    fetchFeedsCounts();
    fetchIngredientCounts();
  }, []);

  const renderCardGrid = (items, columns = '3') => (
    <div className={`grid grid-nogutter sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
      {items.map((item, idx) => (
        <div key={idx} className="col">
          <Card className="shadow-3 px-3 border-round-xl h-full min-h-[360px] flex flex-column hover:shadow-4 transition-shadow duration-500 ease-in-out">
            <div className="flex flex-column justify-between h-full flex-grow">
              {/* Top Content: Title + Description + Badge */}
              <div className="mb-4">
                <div className="flex align-items-center justify-content-between mb-3">
                  <h3 className="text-xl font-semibold text-green-900 mb-1">{item.title}</h3>
                  {item.disabled && <Badge value="Coming Soon" severity="warning" />}
                </div>
                <p className="text-gray-700 min-h-[60px]">{item.description}</p>
              </div>
  
              {/* Bottom: Custom-Styled Button */}
              <div className="mt-auto pt-2">
                {item.link && !item.disabled ? (
                  <a href={item.link}>
                    <Button
                      label="Access"
                      className="w-full unified-button"
                    />
                  </a>
                ) : (
                  <Button
                    label="Coming Soon"
                    className="w-full unified-button"
                    disabled
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );  

  return (
    <div className="bg-gray-50 min-h-screen py-5 px-4">
      <Toast ref={toast} position='top-right' />
      {/* Welcome Message */}
      <div className="mx-auto mb-10 text-center">
        {role !== 'Guest' && (
        <Message
          severity="success"
          content={
            <div className="text-center">
              <p className="font-bold text-2xl text-green-800 mb-2">👋 Welcome, {user?.firstName || 'User'}!</p>
              <p className="text-md text-gray-700">
                You’re logged in to the <span className="font-semibold">Aquaculture Nutrition Feed Portal</span> as <span className='font-semibold'>{role}</span>. Use the tools below to manage feed formulations.
              </p>
            </div>
          }
        />
        )}
        {role === 'Guest' && (
          <Message
            severity="warn"
            summary="Action required"
            detail= 'Message Content'
            content={
              <div className="text-center">
                <span className="font-semibold text-lg">⚠️ Action required: </span>Your account is currently in <span className='font-italic font-semibold'>Guest</span> mode. Please contact the system administrator <a href="mailto:m.salini@deakin.edu.au" className="font-semibold" style={{ "color": "#d19232" }}>m.salini@deakin.edu.au</a> to upgrade your account.
              </div>
            }
          />
        )} 
      </div>

      {/* Core Functionalities */}
      <section className="max-w-7xl mx-auto mb-6">
        <h2 className="text-2xl font-bold">Core Functionalities</h2>
        {renderCardGrid(coreFeatures, '3')}
      </section>

      {/* Platform Info */}
      <section className="max-w-7xl mx-auto mb-6">
        <h2 className="text-2xl font-bold">Platform Information</h2>
        {renderCardGrid(infoFeatures, '2')}
      </section>

      {/* Admin Tools */}
      {isAdmin && (
        <section className="max-w-7xl mx-auto mb-6">
          <h2 className="text-2xl font-bold">Admin Tools</h2>
          {renderCardGrid(adminFeatures, '2')}
        </section>
      )}

      {/* Summary Stats */}
      <section className="max-w-7xl mx-auto mb-6">
        <h2 className="text-2xl font-bold">Summary Stats</h2>
        <div className="grid grid-nogutter sm:grid-cols-3 gap-4">
          <div className="col">
            <Card className="shadow-1 p-2 text-center border-round-xl hover:shadow-4 transition-shadow h-full">
              <i className={`pi pi-database text-4xl`}></i>
              <h3 className="text-lg font-semibold mb-1">Ingredients</h3>
              <p className="text-2xl font-bold">{ingredientCounts} created</p>
            </Card>
          </div>
          <div className="col">
            <Card className="shadow-1 p-2 text-center border-round-xl hover:shadow-4 transition-shadow h-full">
              <i className={`pi pi-database text-4xl`}></i>
              <h3 className="text-lg font-semibold mb-1">Feeds</h3>
              <p className="text-2xl font-bold">{feedsCounts} created</p>
            </Card>
          </div>
          <div className="col">
            <Card className="shadow-1 p-2 text-center border-round-xl hover:shadow-4 transition-shadow h-full">
              <i className={`pi pi-users text-4xl`}></i>
              <h3 className="text-lg font-semibold mb-1">Users</h3>
              <p className="text-2xl font-bold">{usersCounts} active</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-bold">Data Visualisations</h2>
        <ChartsVisualization toastRef={toast} />
      </section>
    </div>
  );
};

export default Dashboard;
