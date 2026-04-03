import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// DSAi generated theme (tokens + Bootstrap integration)
import './generated/css/dsai-theme-bs.css';

// Custom playground styles (extends DSAi design system)
import './scss/custom/main.scss';

import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing in index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
