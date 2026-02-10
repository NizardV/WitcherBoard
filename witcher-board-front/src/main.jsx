import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import WitcherProvider from "./WitcherProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WitcherProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WitcherProvider>
  </StrictMode>,
)
