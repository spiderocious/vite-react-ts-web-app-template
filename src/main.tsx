import { config } from '@/configs';

import '@/utils/performance'; // Initialize performance monitoring
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

// Initialize app with configuration
if (config.env.DEBUG_MODE) {
  console.log('🚀 Starting Frontend Template', {
    version: config.env.APP_VERSION,
    environment: config.isProduction ? 'production' : config.isStaging ? 'staging' : 'development',
    useMocks: config.useMocks,
  });
}

const AppWrapper = config.env.STRICT_MODE
  ? StrictMode
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

createRoot(document.getElementById('root')!).render(
  <AppWrapper>
    <App />
  </AppWrapper>
);
