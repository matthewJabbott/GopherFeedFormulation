import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router';
import logo from '../assets/images/logo.png';
import heroImage from '../assets/images/heroImage.png';
import nusealab from '../assets/images/nusealab.png';

const Home = () => {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section" style={{ 
        backgroundColor: 'var(--dark-green-color)',
        borderRadius: '0 0 2rem 2rem'
      }}>
        <div className="container px-5">
          <div className='flex align-items-center justify-content-between'>
            <div className="flex flex-column align-items-start my-5">
              <span className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl font-medium text-white">
                Feed Formulation Portal
              </span>
              <span className="text-base sm:text-sm md:text-base text-white mt-3">
                Optimize your aquaculture nutrition with our advanced feed formulation platform
              </span>
              <div className="flex justify-content-center lg:justify-content-start mt-5">
                <Button 
                  label="Get Started" 
                  icon="pi pi-arrow-right" 
                  className="p-button-rounded mr-3"
                  onClick={() => navigate('/sign-up')}
                  style={{ background: 'white', color: '#1c8353', border: 'none' }}
                  iconPos="right" 
                />
                <Button 
                  label="Learn More" 
                  className="p-button-rounded p-button-outlined"
                  onClick={() => scrollToSection(aboutRef)}
                  style={{ borderColor: 'white', color: 'white' }}
                  iconPos="right" 
                />
              </div>
            </div>
            <div className='flex justify-content-end'>
              <img 
                src={logo} alt="Logo" 
                style={{
                  maxWidth: '180px',
                  width: '100%',
                  height: 'auto',
                }} 
              />
            </div>
          </div>
        </div>
        <img src={heroImage} alt='Hero' className="w-full h-auto block" />
      </div>

      {/* About Section */}
      <div ref={aboutRef} className="about-section pt-8 pb-6" id="about">
        <div className="mx-auto border-round-lg text-center px-6 py-5 w-11" style={{ backgroundColor: 'var(--light-green-color)' }}>
            <div>
              <h2 className="text-xl sm:text-xl md:text-3xl lg:text-4xl font-semibold mb-5" style={{ color: 'var(--deep-green-color)' }}>About Feed Formulation Portal</h2>
              <p className="text-gray-600 line-height-3 mb-4 text-base sm:text-sm md:text-base lg:text-lg">
                The Feed Formulation Portal is a comprehensive tool designed for aquaculture nutritionists, 
                feed manufacturers, and researchers. Our platform helps optimize feed formulations for various 
                aquaculture species based on nutritional requirements, ingredient availability, and cost considerations.
              </p>
              <p className="text-gray-600 line-height-3 mb-4 text-base sm:text-sm md:text-base lg:text-lg">
                Developed by industry experts and nutritional scientists, our portal combines advanced algorithms 
                with a user-friendly interface to simplify the complex process of feed formulation.
              </p>
            </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section pt-3 pb-5" id="features">
        <div className="container mx-auto">
          <h2 className="text-xl sm:text-xl md:text-3xl lg:text-4xl font-semibold mb-5 text-center" style={{ color: 'var(--deep-green-color)' }}>Key Features</h2>
          <div className="grid grid-nogutter">
            <div className="col-12 md:col-6 lg:col-3 p-3">
              <Card className="h-full shadow-2 hover:shadow-4 transition-duration-300 cursor-pointer">
                <div className="text-center">
                  <i className="pi pi-calculator text-5xl text-primary mb-3"></i>
                  <h3 className="text-xl sm:text-base md:text-md lg:text-xl font-semibold mb-2">Feed Formulation</h3>
                  <p className="text-gray-600 line-height-3">
                    Create optimal feed formulations for different species with precise nutritional balance.
                  </p>
                </div>
              </Card>
            </div>
            <div className="col-12 md:col-6 lg:col-3 p-3">
              <Card className="h-full shadow-2 hover:shadow-4 transition-duration-300 cursor-pointer">
                <div className="text-center">
                  <i className="pi pi-database text-5xl text-primary mb-3" style={{ color: '#1c8353' }}></i>
                  <h3 className="text-xl sm:text-base md:text-md lg:text-xl font-semibold mb-2">Ingredient Library</h3>
                  <p className="text-gray-600 line-height-3">
                    Access a comprehensive database of ingredients with detailed nutritional profiles.
                  </p>
                </div>
              </Card>
            </div>
            <div className="col-12 md:col-6 lg:col-3 p-3">
              <Card className="h-full shadow-2 hover:shadow-4 transition-duration-300 cursor-pointer">
                <div className="text-center">
                  <i className="pi pi-chart-bar text-5xl text-primary mb-3" style={{ color: '#1c8353' }}></i>
                  <h3 className="text-xl sm:text-base md:text-md lg:text-xl font-semibold mb-2">Analysis Tools</h3>
                  <p className="text-gray-600 line-height-3">
                    Analyze nutritional content, cost efficiency, and optimization opportunities.
                  </p>
                </div>
              </Card>
            </div>
            <div className="col-12 md:col-6 lg:col-3 p-3">
              <Card className="h-full shadow-2 hover:shadow-4 transition-duration-300 cursor-pointer">
                <div className="text-center">
                  <i className="pi pi-file-export text-5xl text-primary mb-3" style={{ color: '#1c8353' }}></i>
                  <h3 className="text-xl sm:text-base md:text-md lg:text-xl font-semibold mb-2">Export & Reports</h3>
                  <p className="text-gray-600 line-height-3">
                    Generate and export comprehensive reports in multiple formats for your records.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-content-center mt-5 mb-8 mx-7">
        <img src={nusealab} alt="Nusealab" className="w-full max-w-full h-auto border-round-3xl" />
      </div>

      {/* Call-to-Action Section */}
      <div className="cta-section py-8 px-4 text-center" style={{ 
        background: 'linear-gradient(135deg, #1c8353 0%, #115c3a 100%)',
        padding: '4rem 2rem',
        color: 'white',
        borderRadius: '2rem 2rem 0 0',
        marginTop: '2rem'
      }}>
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Optimize Your Feed Formulations?</h2>
          <p className="text-xl mb-6 line-height-3">
            Join today and take your aquaculture nutrition to the next level
          </p>
          <div className="flex justify-content-center">
            <Button 
              label="Sign Up" 
              icon="pi pi-user-plus" 
              className="p-button-rounded font-bold mr-3"
              onClick={() => navigate('/sign-up')}
              style={{ background: 'white', color: '#1c8353', border: 'none' }}
            />
            <Button 
              label="Login" 
              icon="pi pi-sign-in" 
              className="p-button-rounded p-button-outlined font-bold"
              onClick={() => navigate('/sign-in')}
              style={{ borderColor: 'white', color: 'white' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
