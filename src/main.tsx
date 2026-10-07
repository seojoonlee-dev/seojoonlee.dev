import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const loaded = () => document.documentElement.classList.add('loaded')
if (document.readyState === 'complete') loaded()
else window.addEventListener('load', loaded, { once: true })

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
