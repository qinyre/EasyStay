import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/config' // Import i18n config
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
