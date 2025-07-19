/**
 * About Page Component
 */

import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Template</h1>
          <p className="text-xl text-gray-600">
            Built with the same standards used by Google, Stripe, and other tech giants.
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <h2>Our Mission</h2>
          <p>
            We believe developers should spend time building features, not configuring
            infrastructure. This template embodies the principle that every new project should be a{' '}
            <code>git clone</code>
            away from productive development.
          </p>

          <h2>What Makes Us Different</h2>
          <ul>
            <li>
              <strong>Zero Setup Friction:</strong> Everything pre-configured with sensible defaults
            </li>
            <li>
              <strong>Mock-First Development:</strong> Never blocked by backend development again
            </li>
            <li>
              <strong>One-File Rebranding:</strong> Change entire brand identity instantly
            </li>
            <li>
              <strong>Enterprise-Grade:</strong> Built for scale with TypeScript and best practices
            </li>
          </ul>

          <h2>Architecture Principles</h2>
          <p>
            Every architectural decision prioritizes long-term maintainability: strict TypeScript,
            comprehensive testing infrastructure, consistent code formatting, and barrel exports for
            clean dependency management.
          </p>

          <div className="bg-brand-primary-50 p-6 rounded-lg not-prose">
            <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
            <p className="text-gray-700 mb-4">
              Join thousands of developers who have eliminated setup friction from their workflow.
            </p>
            <Link to={ROUTES.DASHBOARD} className="btn btn-primary">
              Start Building
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
