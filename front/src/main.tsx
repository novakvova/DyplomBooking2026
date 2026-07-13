import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from './App';
import {ThemeProvider} from "./admin/context/ThemeContext.tsx";
import {AppWrapper} from "./admin/components/common/PageMeta.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
          <AppWrapper>
             <App />
          </AppWrapper>
      </ThemeProvider>
  </StrictMode>
);
