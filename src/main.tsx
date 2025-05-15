
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Export the types directly
export * from './context/models/types';

createRoot(document.getElementById("root")!).render(<App />);
