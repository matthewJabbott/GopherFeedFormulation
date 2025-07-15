import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Pages & Components
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AddFeed from './pages/AddFeed';
import AddIngredient from './pages/AddIngredient';
import UserGuide from './pages/UserGuide';
import ViewFeedsPage from './pages/ViewFeedsPage';
import ViewIngredientsMemberPage from './pages/ViewIngredientsMemberPage';
import Layout from './components/layout';
import ProtectedRoute from './pages/ProtectedRoute';
import UserManagement from './pages/UserManagementPage';
import Home from './pages/Home';
import About from './pages/AboutPage';
import Logs from './pages/Logs';
import SpeciesPage from './pages/SpeciesPage';
import ViewIngredientsAdminPage from './pages/ViewIngredientsAdminPage';

import Unauthorised from './pages/UnauthorisedAccess'

const FallbackRedirect = () => {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<Layout><About/></Layout>} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Guest','Admin','Member']}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-feeds"
          element={
            <ProtectedRoute allowedRoles={['Member', 'Admin']}>
              <Layout><ViewFeedsPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-feed/:id?"
          element={
            <ProtectedRoute allowedRoles={['Member','Admin']}>
              <Layout><AddFeed /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-guide"
          element={
            <ProtectedRoute allowedRoles={['Member','Admin']}>
              <Layout><UserGuide /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-ingredients-admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><ViewIngredientsAdminPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-ingredients"
          element={
            <ProtectedRoute allowedRoles={['Member']}>
              <Layout><ViewIngredientsMemberPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><Logs /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-ingredient"
          element={
            <ProtectedRoute allowedRoles={['Member','Admin']}>
              <Layout><AddIngredient /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/unauthorised"
          element={
            <ProtectedRoute allowedRoles={['Guest','Member','Admin']}>
              <Layout><Unauthorised /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/species'
          element={
            <ProtectedRoute allowedRoles={['Member','Admin','SuperAdmin']}>
              <Layout><SpeciesPage /></Layout>
            </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;