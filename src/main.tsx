import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { installInteractionPerformanceMonitor } from './devtools/interaction-performance-monitor.ts'

installInteractionPerformanceMonitor()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
