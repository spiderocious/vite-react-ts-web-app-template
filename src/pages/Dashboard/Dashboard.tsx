/** * Dashboard Page Component * * Protected route example showing authenticated user dashboard. */ import { config } from '@/configs';
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {' '}
      {/* Header */}{' '}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {' '}
        <div className="container mx-auto px-4 py-6">
          {' '}
          <div className="flex items-center justify-between">
            {' '}
            <div>
              {' '}
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>{' '}
              <p className="text-gray-600 mt-1">
                Here&apos;s what&apos;s happening with your projects today.
              </p>{' '}
            </div>{' '}
            <div className="flex items-center space-x-4">
              {' '}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold">
                {' '}
                Pro Plan{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
      <div className="container mx-auto px-4 py-8">
        {' '}
        {/* Stats Grid */}{' '}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {' '}
          {/* Total Users */}{' '}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            {' '}
            <div className="flex items-center justify-between">
              {' '}
              <div>
                {' '}
                <p className="text-3xl font-bold text-gray-900">1,234</p>{' '}
                <p className="text-sm text-gray-500 mt-1">Total Users</p>{' '}
                <div className="flex items-center mt-2">
                  {' '}
                  <span className="text-green-500 text-sm font-medium">+12.5%</span>{' '}
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>{' '}
                </div>{' '}
              </div>{' '}
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                {' '}
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {' '}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />{' '}
                </svg>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          {/* Projects */}{' '}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            {' '}
            <div className="flex items-center justify-between">
              {' '}
              <div>
                {' '}
                <p className="text-3xl font-bold text-gray-900">567</p>{' '}
                <p className="text-sm text-gray-500 mt-1">Active Projects</p>{' '}
                <div className="flex items-center mt-2">
                  {' '}
                  <span className="text-blue-500 text-sm font-medium">+8.2%</span>{' '}
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>{' '}
                </div>{' '}
              </div>{' '}
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                {' '}
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {' '}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />{' '}
                </svg>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          {/* Revenue */}{' '}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            {' '}
            <div className="flex items-center justify-between">
              {' '}
              <div>
                {' '}
                <p className="text-3xl font-bold text-gray-900">$89.2K</p>{' '}
                <p className="text-sm text-gray-500 mt-1">Total Revenue</p>{' '}
                <div className="flex items-center mt-2">
                  {' '}
                  <span className="text-green-500 text-sm font-medium">+15.3%</span>{' '}
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>{' '}
                </div>{' '}
              </div>{' '}
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                {' '}
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {' '}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />{' '}
                </svg>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          {/* Performance */}{' '}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            {' '}
            <div className="flex items-center justify-between">
              {' '}
              <div>
                {' '}
                <p className="text-3xl font-bold text-gray-900">98.5%</p>{' '}
                <p className="text-sm text-gray-500 mt-1">Uptime</p>{' '}
                <div className="flex items-center mt-2">
                  {' '}
                  <span className="text-green-500 text-sm font-medium">+0.2%</span>{' '}
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>{' '}
                </div>{' '}
              </div>{' '}
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                {' '}
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {' '}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />{' '}
                </svg>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        {/* Main Content Grid */}{' '}
        <div className="grid lg:grid-cols-3 gap-8">
          {' '}
          {/* Recent Activity */}{' '}
          <div className="lg:col-span-2">
            {' '}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {' '}
              <div className="flex items-center justify-between mb-6">
                {' '}
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>{' '}
              </div>{' '}
              <div className="space-y-4">
                {' '}
                {[
                  { action: 'New user registered', time: '2 minutes ago', color: 'blue' },
                  {
                    action: 'Project "React Dashboard" deployed',
                    time: '15 minutes ago',
                    color: 'green',
                  },
                  { action: 'Database backup completed', time: '1 hour ago', color: 'purple' },
                  { action: 'API endpoint updated', time: '3 hours ago', color: 'orange' },
                  { action: 'Security scan passed', time: '6 hours ago', color: 'emerald' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {' '}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color === 'blue' ? 'bg-blue-100' : item.color === 'green' ? 'bg-green-100' : item.color === 'purple' ? 'bg-purple-100' : item.color === 'orange' ? 'bg-orange-100' : 'bg-emerald-100'}`}
                    >
                      {' '}
                      <div
                        className={`w-3 h-3 rounded-full ${item.color === 'blue' ? 'bg-blue-500' : item.color === 'green' ? 'bg-green-500' : item.color === 'purple' ? 'bg-purple-500' : item.color === 'orange' ? 'bg-orange-500' : 'bg-emerald-500'}`}
                      />{' '}
                    </div>{' '}
                    <div className="flex-1">
                      {' '}
                      <p className="font-medium text-gray-900">{item.action}</p>{' '}
                      <p className="text-sm text-gray-500">{item.time}</p>{' '}
                    </div>{' '}
                  </div>
                ))}{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
          {/* Quick Actions & System Status */}{' '}
          <div className="space-y-6">
            {' '}
            {/* Quick Actions */}{' '}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {' '}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>{' '}
              <div className="space-y-3">
                {' '}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  {' '}
                  Create New Project{' '}
                </button>{' '}
                <button className="w-full border-2 border-gray-200 text-gray-700 p-4 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                  {' '}
                  Deploy Application{' '}
                </button>{' '}
                <button className="w-full border-2 border-gray-200 text-gray-700 p-4 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                  {' '}
                  View Analytics{' '}
                </button>{' '}
              </div>{' '}
            </div>{' '}
            {/* System Status */}{' '}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {' '}
              <h3 className="text-xl font-bold text-gray-900 mb-4">System Status</h3>{' '}
              <div className="space-y-4">
                {' '}
                <div className="flex items-center justify-between">
                  {' '}
                  <span className="text-gray-600">API Status</span>{' '}
                  <div className="flex items-center">
                    {' '}
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />{' '}
                    <span className="text-green-600 font-medium">Operational</span>{' '}
                  </div>{' '}
                </div>{' '}
                <div className="flex items-center justify-between">
                  {' '}
                  <span className="text-gray-600">Database</span>{' '}
                  <div className="flex items-center">
                    {' '}
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />{' '}
                    <span className="text-green-600 font-medium">Connected</span>{' '}
                  </div>{' '}
                </div>{' '}
                <div className="flex items-center justify-between">
                  {' '}
                  <span className="text-gray-600">CDN</span>{' '}
                  <div className="flex items-center">
                    {' '}
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />{' '}
                    <span className="text-yellow-600 font-medium">Degraded</span>{' '}
                  </div>{' '}
                </div>{' '}
                <div className="flex items-center justify-between">
                  {' '}
                  <span className="text-gray-600">Monitoring</span>{' '}
                  <div className="flex items-center">
                    {' '}
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />{' '}
                    <span className="text-green-600 font-medium">Active</span>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        {/* Configuration Info for Development */}{' '}
        {config.isDevelopment && (
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
            {' '}
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Development Configuration
            </h3>{' '}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {' '}
              <div className="bg-white p-4 rounded-xl shadow-sm">
                {' '}
                <div className="text-sm text-gray-500 mb-1">Environment</div>{' '}
                <div className="font-bold text-indigo-600">
                  {' '}
                  {config.env.IS_DEVELOPMENT ? 'Development' : 'Production'}{' '}
                </div>{' '}
              </div>{' '}
              <div className="bg-white p-4 rounded-xl shadow-sm">
                {' '}
                <div className="text-sm text-gray-500 mb-1">Mock Services</div>{' '}
                <div className="font-bold text-purple-600">
                  {' '}
                  {config.useMocks ? 'Enabled' : 'Disabled'}{' '}
                </div>{' '}
              </div>{' '}
              <div className="bg-white p-4 rounded-xl shadow-sm">
                {' '}
                <div className="text-sm text-gray-500 mb-1">Version</div>{' '}
                <div className="font-bold text-blue-600">{config.env.APP_VERSION}</div>{' '}
              </div>{' '}
              <div className="bg-white p-4 rounded-xl shadow-sm">
                {' '}
                <div className="text-sm text-gray-500 mb-1">Build Mode</div>{' '}
                <div className="font-bold text-green-600">Vite + HMR</div>{' '}
              </div>{' '}
            </div>{' '}
          </div>
        )}{' '}
      </div>{' '}
    </div>
  );
}
