import { Link } from 'react-router-dom';

import { config } from '@/configs';
import { ROUTES } from '@/constants/routes';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg" />
            <span className="text-xl font-bold text-gray-900">{config.env.APP_NAME}</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to={ROUTES.ABOUT} className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link
              to={ROUTES.COMPONENTS_DEMO}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Components
            </Link>
            <Link
              to={ROUTES.DASHBOARD}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-8">
            🚀 Production-Ready Template
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            Build Amazing{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              React Apps
            </span>{' '}
            Faster
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A revolutionary React TypeScript template with enterprise-grade tooling, beautiful
            components, and zero setup friction. Start building features, not infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to={ROUTES.DASHBOARD}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:scale-105 transform transition-all duration-200 min-w-[200px]"
            >
              Get Started Free
            </Link>

            <Link
              to={ROUTES.COMPONENTS_DEMO}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 min-w-[200px]"
            >
              View Components
            </Link>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-xl p-6 transform -rotate-3">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-indigo-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-8 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Template?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with modern tools and best practices to accelerate your development workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with Vite for instant hot reload, optimized production builds, and superior
                developer experience.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Type Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                100% TypeScript coverage with strict configuration for enterprise-grade applications
                and better DX.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Production Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Includes monitoring, analytics, PWA features, testing infrastructure, and deployment
                configuration.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Built With Modern Tech Stack
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React', color: 'from-blue-400 to-cyan-400' },
              { name: 'TypeScript', color: 'from-blue-500 to-indigo-500' },
              { name: 'Vite', color: 'from-purple-500 to-pink-500' },
              { name: 'Tailwind', color: 'from-cyan-500 to-teal-500' },
            ].map((tech) => (
              <div key={tech.name} className="text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-2xl mx-auto mb-3 flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">{tech.name[0]}</span>
                </div>
                <p className="font-semibold text-gray-700">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Info */}
        {config.isDevelopment && (
          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-cyan-50 p-8 rounded-2xl border border-indigo-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Development Configuration
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Environment</div>
                <div className="font-bold text-indigo-600">
                  {config.env.IS_DEVELOPMENT ? 'Development' : 'Production'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Mock Services</div>
                <div className="font-bold text-cyan-600">
                  {config.useMocks ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Version</div>
                <div className="font-bold text-purple-600">{config.env.APP_VERSION}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Theme</div>
                <div className="font-bold text-green-600">{config.env.DEFAULT_THEME}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who have eliminated setup friction from their workflow.
          </p>
          <Link
            to={ROUTES.DASHBOARD}
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
          >
            Start Building Now
          </Link>
        </div>
      </div>
    </div>
  );
}
