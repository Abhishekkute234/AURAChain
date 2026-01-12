// aurachain-ui/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import LandingPage from './components/LandingPage/LandingPage';
import AboutPage from './components/About/AboutPage'; 
import BusinessModelPage from './components/BusinessModel/BusinessModelPage';
import Dashboard from './Dashboard';

// Import Scroll Helper
import ScrollToTop from './components/Shared/ScrollToTop'; // <--- Import this

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop /> {/* <--- Add this here, inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/business-model" element={<BusinessModelPage />} />
        <Route path="/details" element={<BusinessModelPage />} /> 
        <Route path="/app" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
// // aurachain-ui/src/main.tsx
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
