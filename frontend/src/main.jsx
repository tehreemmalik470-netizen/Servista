import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google' // Google OAuth import kiya

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Aapki exact Client ID yahan set kar di hai */}
    <GoogleOAuthProvider clientId="774992072766-uq51213fkpn8phkuia2g9q3t4ourr9js.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)