/**
 * 401 Unauthorized Page
 */

import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H8m13-9a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You don't have permission to access this page. Please log in with the appropriate
          credentials or contact an administrator.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to={ROUTES.LOGIN} className="btn btn-primary px-6 py-3">
            Sign In
          </Link>

          <Link to={ROUTES.HOME} className="btn btn-outline px-6 py-3">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
