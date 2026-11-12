import { createRoot } from 'react-dom/client';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/700.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
