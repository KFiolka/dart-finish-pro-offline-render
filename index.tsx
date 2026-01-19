import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render the app:", error);
  rootElement.innerHTML = `<div style="color: white; padding: 20px; text-align: center;"><h1>Kritischer Fehler</h1><p>${error instanceof Error ? error.message : String(error)}</p></div>`;
}