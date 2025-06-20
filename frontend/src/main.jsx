import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx'

export const server = 'https://educare-institute.onrender.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
    
  </StrictMode>,
)
