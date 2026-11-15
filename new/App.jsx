import React, { useState } from 'react';
import ProductList from './ProductList';
import './App.css';

function App() {
  const [showProductList, setShowProductList] = useState(false);

  const handleGetStartedClick = () => {
    setShowProductList(true);
  };

  return (
    <div className="app-container">
      {!showProductList ? (
        <div className="bg-image">
          <div className="landing-page">
            <div className="landing-content">
              <h1>Welcome To Paradise Nursery</h1>
              <p>Where Green Meets Serenity</p>
              <button className="get-started-button" onClick={handleGetStartedClick}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ProductList />
      )}
    </div>
  );
}

export default App;