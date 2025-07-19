/**
 * 404 Not Found Page
 */

import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-brand-primary-100 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-12 h-12 text-brand-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or
          you entered the wrong URL.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to={ROUTES.HOME} className="btn btn-primary px-6 py-3">
            Go Home
          </Link>

          <button
            onClick={() => {
              window.history.back();
            }}
            className="btn btn-outline px-6 py-3"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Maybe you were looking for:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to={ROUTES.DASHBOARD}
              className="text-brand-primary-600 hover:text-brand-primary-700 text-sm underline"
            >
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to={ROUTES.ABOUT}
              className="text-brand-primary-600 hover:text-brand-primary-700 text-sm underline"
            >
              About
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              to={ROUTES.CONTACT}
              className="text-brand-primary-600 hover:text-brand-primary-700 text-sm underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
