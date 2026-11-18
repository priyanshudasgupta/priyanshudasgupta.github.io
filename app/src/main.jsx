import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// The HTML is pre-rendered at build time; React takes it over here.
hydrateRoot(document.getElementById('root'), <StrictMode><App /></StrictMode>);
