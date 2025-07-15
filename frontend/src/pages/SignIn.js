import React from 'react';
import { SignIn as ClerkSignIn, useSignIn } from '@clerk/clerk-react';
import { Link } from 'react-router';

const SignIn = () => {
  const { isLoaded } = useSignIn();

  if (!isLoaded) return null;

  return (
    <div>
      <div className="pl-4 pt-4">
        <Link to="/" className="text-green-700 text-lg font-semibold hover:underline">
          <i className="pi pi-home mr-2 text-3xl" style={{ color: 'var(--deep-green-color)' }}></i>
        </Link>
      </div>

      <div className="flex justify-content-center align-items-center">
        <div className="p-4 w-50rem text-center">
          <ClerkSignIn 
            signUpUrl='/sign-up' 
            afterSignInUrl='/dashboard'
            appearance={{
              variables: {
                colorPrimary: '#1c8353',
              },
              elements: {
                formButtonPrimary: 'custom-title text-white font-semibold py-2 px-4 rounded',
                headerTitle: 'text-xl sm:text-lg md:text-xl lg:text-2xl font-bold'
              }
            }}  
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
