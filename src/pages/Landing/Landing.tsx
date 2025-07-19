/**
 * Landing Page Component
 *
 * The main landing page showcasing the application features.
 */

import { Link } from 'react-router-dom';

import { config } from '@/configs';
import { ROUTES } from '@/constants/routes';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-brand-primary-500">{config.env.APP_NAME}</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A revolutionary React starter template that eliminates setup friction and provides
            enterprise-grade development experience from day one.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to={ROUTES.DASHBOARD} className="btn btn-primary px-8 py-3 text-lg">
              Get Started
            </Link>

            <Link to={ROUTES.ABOUT} className="btn btn-outline px-8 py-3 text-lg">
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-brand-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-brand-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Built with Vite for instant hot reload and optimized production builds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-brand-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-brand-secondary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Type Safe</h3>
            <p className="text-gray-600">
              100% TypeScript coverage with strict configuration for enterprise-grade applications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-brand-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-brand-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Production Ready</h3>
            <p className="text-gray-600">
              Includes monitoring, analytics, PWA features, and deployment configuration.
            </p>
          </div>
        </div>

        {/* Configuration Info */}
        {config.isDevelopment && (
          <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Development Configuration</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Environment:</strong>{' '}
                {config.env.IS_DEVELOPMENT ? 'Development' : 'Production'}
              </div>
              <div>
                <strong>Mock Services:</strong> {config.useMocks ? 'Enabled' : 'Disabled'}
              </div>
              <div>
                <strong>Version:</strong> {config.env.APP_VERSION}
              </div>
              <div>
                <strong>Theme:</strong> {config.env.DEFAULT_THEME}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
