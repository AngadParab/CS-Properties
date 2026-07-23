import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'
import { PropertyProvider } from './context/PropertyContext'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <FilterProvider>
            <PropertyProvider>
              <App />
            </PropertyProvider>
          </FilterProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  </StrictMode>,
)
