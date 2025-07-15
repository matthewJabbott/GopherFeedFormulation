import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import { Button } from 'primereact/button';
import { useUserRole } from '../utils/UserRole'

const Layout = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { role } = useUserRole();

  const signedInMenu = [
    ...(role === 'Admin' ? [
      { label: 'Ingredients', command: () => navigate('/view-ingredients-admin') },
    ] : [
      { label: 'Ingredients', command: () => navigate('/view-ingredients') },
    ]),
    { label: 'Feeds', command: () => navigate('/view-feeds') },
    ...(role === 'Admin' ? [
      { label: 'Users', command: () => navigate('/user-management') },
      { label: 'Logs', command: () => navigate('/logs') },
    ] : [])
  ];

  const loggedOutMenu = [
    { label: 'About', command: () => navigate('/about') },
  ];

  return (
    <div className="flex flex-column min-h-screen"> {/* full-height container */}
      <Menubar
        start={
          <span
            className="text-lg font-bold cursor-pointer px-5"
            style={{ color: 'var(--dark-green-color)' }}
            onClick={() => navigate(isSignedIn ? '/dashboard' : '/')}>
            Home
          </span>
        }
        style={{ fontSize: '1rem', fontWeight: '500' }}
        model={isSignedIn ? signedInMenu : loggedOutMenu}
        end={
          isSignedIn ? <UserButton /> : (
            <div>
              <Button 
                label="Login" icon="pi pi-sign-in" 
                onClick={() => navigate('/sign-in')} 
                className="mx-2 text-base" text
                style={{ color: 'var(--dark-green-color)' }} 
              />
              <Button 
                label="Register" 
                onClick={() => navigate('/sign-up')} 
                icon="pi pi-user-plus" 
                className='mx-2 text-base'
                style={{ backgroundColor: 'var(--dark-green-color)', borderColor: 'var(--dark-green-color)' }} 
              />
            </div>
          )
        }
        className="w-full py-2"
      />

      {/* Main content that grows to fill space */}
      <div className="flex-1">
        {children}
      </div>

      {/* Sticky footer */}
      <footer className="footer-section py-2 px-4 border-top-1" style={{ borderColor: '#E8E8E8', backgroundColor: "#F8F8F8" }}>
        <div className="mx-auto">
          {!isSignedIn && (
            <div className="grid pt-3 border-bottom-1 pb-4" style={{ borderColor: '#C8C8C8' }}>
              <div className="col-12 md:col-4 mb-3 md:mb-0">
                <h3 className="font-medium text-lg mb-3">Feed Formulation Portal</h3>
                <p className="line-height-3 text-gray-400">
                  Advanced nutrition management for aquaculture species
                </p>
              </div>
              <div className="col-12 md:col-4 mb-3 md:mb-0">
                <h3 className="font-medium text-lg mb-3">Quick Links</h3>
                <ul className="list-none p-0 m-0">
                  <li className="mb-2"><a href="/about" className="text-gray-400 no-underline">About Us</a></li>
                  <li className="mb-2"><a href="/sign-in" className="text-gray-400 no-underline">Login</a></li>
                  <li><a href="/sign-up" className="text-gray-400 no-underline">Register</a></li>
                </ul>
              </div>
              <div className="col-12 md:col-4 mb-3">
                <h3 className="font-medium text-lg mb-3">Contact</h3>
                <ul className="list-none p-0 m-0">
                  <li className="mb-2 flex align-items-center">
                    <i className="pi pi-envelope mr-2 text-gray-400"></i>
                    <span className="text-gray-400">m.salini@deakin.edu.au</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="py-1 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Deakin University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
