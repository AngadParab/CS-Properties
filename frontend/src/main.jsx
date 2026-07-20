import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'
import { PropertyProvider } from './context/PropertyContext'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <FilterProvider>
          <PropertyProvider>
            <App />
          </PropertyProvider>
        </FilterProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
