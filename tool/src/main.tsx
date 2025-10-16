import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


function initTheme(){
  const savedTheme = localStorage.getItem('theme');
  const prefersDark= window.matchMedia('(prefers-color-scheme:dark)').matches;

  if(savedTheme ==='dark' || (!savedTheme && prefersDark)){
    document.documentElement.classList.add('dark');
  }else{
    document.documentElement.classList.remove('dark');
  }
}

initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
