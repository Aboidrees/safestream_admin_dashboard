export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          SafeStream Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Family Management</h2>
            <p className="text-gray-600 mb-4">Manage your family members and child profiles</p>
            <a href="/(dashboard)/admin" className="text-blue-600 hover:underline">
              Go to Admin →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Content Management</h2>
            <p className="text-gray-600 mb-4">Create and manage content collections</p>
            <a href="#" className="text-blue-600 hover:underline">
              Manage Content →
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Screen Time Control</h2>
            <p className="text-gray-600 mb-4">Monitor and control screen time limits</p>
            <a href="#" className="text-blue-600 hover:underline">
              View Controls →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
