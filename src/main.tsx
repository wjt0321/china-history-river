import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import './styles/global.css'
import './components/MapView.css'
import './components/Timeline.css'
import './components/DetailPanel.css'
import './components/TopBar.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
