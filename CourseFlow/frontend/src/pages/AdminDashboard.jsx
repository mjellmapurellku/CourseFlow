import { useState } from "react";
import { 
  FaBars, FaBell, FaBook, FaChalkboardTeacher, FaCog, FaSignOutAlt, 
  FaTachometerAlt, FaUser, FaUsers, FaSearch, FaEnvelope, FaRocket,
  FaChevronDown, FaChevronRight, FaCalendar, FaDollarSign, FaClipboard,
  FaComments, FaChartLine, FaChartPie, FaTasks, FaDesktop, FaTablet,
  FaMobile, FaArrowRight
} from "react-icons/fa";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen" style={{backgroundColor: '#f8f9fc'}}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} text-white transition-all duration-300`} style={{backgroundColor: '#1e3a8a'}}>
        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: '#1e293b'}}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold" style={{color: '#1e3a8a'}}>😊</span>
            </div>
            {sidebarOpen && <h1 className="text-xl font-bold">CourseFlow Admin</h1>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-white hover:bg-opacity-10 rounded-full p-1">
            <FaBars />
          </button>
        </div>

        <nav className="mt-4 flex flex-col space-y-1 px-2">
          {/* Dashboard - Active */}
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg" style={{backgroundColor: '#1e293b'}}>
            <FaTachometerAlt className="text-white" />
            {sidebarOpen && <span className="text-white font-medium">Dashboard</span>}
          </a>
          
          {/* Interface Section */}
          {sidebarOpen && (
            <div className="mt-6">
              <div className="flex items-center space-x-3 p-3 text-gray-300 text-sm font-semibold uppercase tracking-wider">
                <span>Interface</span>
              </div>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10">
                <FaChevronRight className="text-xs" />
                {sidebarOpen && <span>Components</span>}
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10">
                <FaChevronRight className="text-xs" />
                {sidebarOpen && <span>Utilities</span>}
              </a>
            </div>
          )}

          {/* Addons Section */}
          {sidebarOpen && (
            <div className="mt-4">
              <div className="flex items-center space-x-3 p-3 text-gray-300 text-sm font-semibold uppercase tracking-wider">
                <span>Addons</span>
              </div>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10">
                <FaBook />
                {sidebarOpen && <span>Pages</span>}
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10">
                <FaChartLine />
                {sidebarOpen && <span>Charts</span>}
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10">
                <FaTablet />
                {sidebarOpen && <span>Tables</span>}
              </a>
            </div>
          )}

          {/* Upgrade Section */}
          {sidebarOpen && (
            <div className="mt-auto p-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-center">
                <FaRocket className="text-white text-2xl mx-auto mb-2" />
                <p className="text-white text-sm font-medium mb-2">CourseFlow Pro</p>
                <p className="text-green-100 text-xs mb-3">Upgrade to unlock premium features, advanced analytics, and more!</p>
                <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-2 px-4 rounded">
                  Upgrade to Pro!
                </button>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex justify-between items-center p-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for anything..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{width: '300px'}}
                />
                <button className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Search
                </button>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <FaBell className="text-gray-600 cursor-pointer text-lg" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
              
              {/* Messages */}
              <div className="relative">
                <FaEnvelope className="text-gray-600 cursor-pointer text-lg" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">7</span>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <FaUser className="text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium">Admin User</span>
              </div>

              {/* Generate Report Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <FaClipboard />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6" style={{backgroundColor: '#f8f9fc'}}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Earnings Monthly */}
            <div className="bg-white rounded-lg shadow-sm border-l-4" style={{borderLeftColor: '#1e3a8a'}}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Earnings (Monthly)</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">$40,000</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FaCalendar className="text-2xl" style={{color: '#1e3a8a'}} />
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Annual */}
            <div className="bg-white rounded-lg shadow-sm border-l-4" style={{borderLeftColor: '#10b981'}}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Earnings (Annual)</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">$215,000</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FaDollarSign className="text-2xl" style={{color: '#10b981'}} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="bg-white rounded-lg shadow-sm border-l-4" style={{borderLeftColor: '#46caeb'}}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">50%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="h-2 rounded-full" style={{backgroundColor: '#46caeb', width: '50%'}}></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <FaClipboard className="text-2xl" style={{color: '#46caeb'}} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="bg-white rounded-lg shadow-sm border-l-4" style={{borderLeftColor: '#f59e0b'}}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">18</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FaComments className="text-2xl" style={{color: '#f59e0b'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Additional Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Earnings Overview */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center">
                    <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart would be rendered here</p>
                    <p className="text-sm text-gray-400">Monthly earnings from Jan to Nov</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Sources */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center">
                    <FaChartPie className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Donut chart would be rendered here</p>
                    <div className="flex justify-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#10b981'}}></div>
                        <span className="text-sm text-gray-600">Direct</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#46caeb'}}></div>
                        <span className="text-sm text-gray-600">Social</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#1e3a8a'}}></div>
                        <span className="text-sm text-gray-600">Referral</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
              <div className="space-y-4">
                {/* Server Migration */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Server Migration</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="h-2 rounded-full" style={{backgroundColor: '#ef4444', width: '20%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-4">20%</span>
                </div>

                {/* Sales Tracking */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Sales Tracking</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="h-2 rounded-full" style={{backgroundColor: '#f59e0b', width: '40%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-4">40%</span>
                </div>

                {/* Customer Database */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Customer Database</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="h-2 rounded-full" style={{backgroundColor: '#1e3a8a', width: '60%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-4">60%</span>
                </div>

                {/* Payout Details */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Payout Details</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="h-2 rounded-full" style={{backgroundColor: '#46caeb', width: '80%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-4">80%</span>
                </div>

                {/* Account Setup */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Account Setup</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="h-2 rounded-full" style={{backgroundColor: '#10b981', width: '100%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium" style={{color: '#10b981'}}>Complete!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Illustrations Card */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Illustrations</h3>
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <FaDesktop className="text-3xl text-gray-400" />
                    <FaTablet className="text-2xl text-gray-400" />
                    <FaMobile className="text-xl text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add some quality, svg illustrations to your project courtesy of unDraw, a constantly updated collection of beautiful svg images that you can use completely free and without attribution!
                  </p>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1">
                    <span>Browse Illustrations on unDraw</span>
                    <FaArrowRight className="text-xs" />
                  </a>
                </div>
              </div>
            </div>

            {/* Development Approach Card */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Approach</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    CourseFlow uses a modern, component-based approach to development, ensuring scalability and maintainability.
                  </p>
                  <p className="text-sm text-gray-600">
                    Our development methodology focuses on user experience, performance optimization, and clean code practices.
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">React</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Node.js</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">MongoDB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
