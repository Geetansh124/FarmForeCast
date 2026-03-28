import { useState } from 'react';
import { 
  MessageSquare, 
  TrendingUp,
  Cloud,
  AlertTriangle,
  Shield,
  BarChart3,
  Activity,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
  Search
} from 'lucide-react';
import { adminDashboardConfig } from '../config';

// Mock data for admin dashboard
const mockAdvisoryLogs = [
  { id: 1, farmer: "Rajesh Kumar", location: "Ludhiana, Punjab", advice: "Delay harvesting - Heavy rain", priority: "high", timestamp: "2 mins ago" },
  { id: 2, farmer: "Amar Singh", location: "Amritsar, Punjab", advice: "Apply fungicide spray", priority: "high", timestamp: "15 mins ago" },
  { id: 3, farmer: "Gurpreet Kaur", location: "Jalandhar, Punjab", advice: "Irrigation recommended", priority: "medium", timestamp: "32 mins ago" },
  { id: 4, farmer: "Harpreet Singh", location: "Bathinda, Punjab", advice: "Optimal sowing conditions", priority: "low", timestamp: "1 hour ago" },
  { id: 5, farmer: "Manjit Kaur", location: "Patiala, Punjab", advice: "Monitor for aphids", priority: "medium", timestamp: "2 hours ago" },
];

const mockPestRisks = [
  { id: 1, pest: "Fungal Disease", affected: 234, trend: "up", severity: "high", regions: ["Ludhiana", "Amritsar"] },
  { id: 2, pest: "Aphid Infestation", affected: 89, trend: "stable", severity: "medium", regions: ["Jalandhar"] },
  { id: 3, pest: "Stem Borer", affected: 45, trend: "down", severity: "low", regions: ["Patiala"] },
];

const mockInsuranceClaims = [
  { id: "INS-001", farmer: "Rajesh Kumar", location: "Ludhiana", rainfall: 115, threshold: 100, status: "Processing", amount: "₹50,000" },
  { id: "INS-002", farmer: "Amar Singh", location: "Amritsar", rainfall: 108, threshold: 100, status: "Approved", amount: "₹75,000" },
  { id: "INS-003", farmer: "Gurpreet Kaur", location: "Jalandhar", rainfall: 95, threshold: 100, status: "Monitoring", amount: "-" },
];

const weatherStations = [
  { location: "Ludhiana", temp: 28, humidity: 82, rainfall: 75, status: "active" },
  { location: "Amritsar", temp: 29, humidity: 78, rainfall: 68, status: "active" },
  { location: "Jalandhar", temp: 30, humidity: 75, rainfall: 45, status: "active" },
  { location: "Patiala", temp: 31, humidity: 70, rainfall: 30, status: "maintenance" },
  { location: "Bathinda", temp: 32, humidity: 65, rainfall: 20, status: "active" },
];

// Get trend icon
const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'down':
      return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
    default:
      return <Activity className="w-4 h-4 text-amber-400" />;
  }
};

// Get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'low':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

// Get severity color
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'text-red-400 bg-red-500/20';
    case 'medium':
      return 'text-amber-400 bg-amber-500/20';
    case 'low':
      return 'text-emerald-400 bg-emerald-500/20';
    default:
      return 'text-slate-400 bg-slate-500/20';
  }
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'processing':
      return 'text-amber-400 bg-amber-500/20';
    case 'approved':
      return 'text-emerald-400 bg-emerald-500/20';
    case 'monitoring':
      return 'text-blue-400 bg-blue-500/20';
    default:
      return 'text-slate-400 bg-slate-500/20';
  }
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <section id="admin" className="relative min-h-screen bg-[#0a0a0a] py-20 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-blue-400/80 text-sm tracking-[0.3em] uppercase mb-2">
              {adminDashboardConfig.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-white">
              {adminDashboardConfig.mainTitle}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className={`p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5 text-white/60" />
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-white/80">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl border border-blue-500/30 transition-all text-blue-400">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {adminDashboardConfig.stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
            >
              <p className="text-white/60 text-sm mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-light text-white">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-red-400' : 'text-amber-400'}`}>
                  {getTrendIcon(stat.trend)}
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'weather', label: 'Weather Stations', icon: Cloud },
            { id: 'advisories', label: 'Advisory Log', icon: MessageSquare },
            { id: 'pests', label: 'Pest Risks', icon: AlertTriangle },
            { id: 'insurance', label: 'Insurance', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                ${activeTab === tab.id 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weather Overview */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-400" />
                    {adminDashboardConfig.sections.weather}
                  </h3>
                  <span className="text-white/40 text-sm">Live</span>
                </div>
                
                <div className="space-y-4">
                  {weatherStations.slice(0, 3).map((station, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${station.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        <div>
                          <p className="text-white font-medium">{station.location}</p>
                          <p className="text-white/40 text-sm">{station.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/60">{station.temp}°C</span>
                        <span className="text-blue-400">{station.rainfall}mm</span>
                        <span className="text-white/40">{station.humidity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Advisories */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    {adminDashboardConfig.sections.advisories}
                  </h3>
                  <button className="text-blue-400 text-sm flex items-center gap-1 hover:underline">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {mockAdvisoryLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white text-sm font-medium">{log.farmer}</p>
                        <p className="text-white/40 text-xs">{log.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${getPriorityColor(log.priority)}`}>
                          {log.priority}
                        </span>
                        <p className="text-white/40 text-xs mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pest Risks */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    {adminDashboardConfig.sections.pests}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {mockPestRisks.map((risk) => (
                    <div key={risk.id} className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium">{risk.pest}</p>
                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(risk.severity)}`}>
                          {risk.severity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{risk.affected} farms affected</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(risk.trend)}
                          <span className="text-white/40">{risk.regions.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance Status */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    {adminDashboardConfig.sections.insurance}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {mockInsuranceClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white text-sm font-medium">{claim.id}</p>
                        <p className="text-white/40 text-xs">{claim.farmer} • {claim.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                        <p className="text-emerald-400 text-sm mt-1">{claim.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Weather Stations Tab */}
          {activeTab === 'weather' && (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">All Weather Stations</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                      type="text" 
                      placeholder="Search stations..."
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-white/40 text-sm border-b border-white/10">
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Temperature</th>
                      <th className="text-left py-3 px-4">Humidity</th>
                      <th className="text-left py-3 px-4">Rainfall</th>
                      <th className="text-left py-3 px-4">Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherStations.map((station, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-white/40" />
                            <span className="text-white">{station.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${station.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${station.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {station.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white">{station.temp}°C</td>
                        <td className="py-4 px-4 text-white">{station.humidity}%</td>
                        <td className="py-4 px-4 text-blue-400">{station.rainfall}mm</td>
                        <td className="py-4 px-4 text-white/40 text-sm">Just now</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Advisory Log Tab */}
          {activeTab === 'advisories' && (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Complete Advisory Log</h3>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-sm">Total: {mockAdvisoryLogs.length * 15}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {mockAdvisoryLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 font-medium">{log.farmer.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{log.farmer}</p>
                        <p className="text-white/40 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {log.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 mx-8">
                      <p className="text-white/80 text-sm">{log.advice}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getPriorityColor(log.priority)}`}>
                        {log.priority}
                      </span>
                      <p className="text-white/40 text-xs mt-2 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {log.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pest Risks Tab */}
          {activeTab === 'pests' && (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-6">Active Pest Risk Monitoring</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockPestRisks.map((risk) => (
                  <div key={risk.id} className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <AlertTriangle className={`w-8 h-8 ${risk.severity === 'high' ? 'text-red-400' : risk.severity === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor(risk.severity)}`}>
                        {risk.severity}
                      </span>
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2">{risk.pest}</h4>
                    <p className="text-white/60 text-sm mb-4">{risk.affected} farms currently at risk</p>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span className="text-white/40">{risk.regions.join(', ')}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                      {getTrendIcon(risk.trend)}
                      <span className="text-white/60 text-sm">Trend: {risk.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Tab */}
          {activeTab === 'insurance' && (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-6">Parametric Insurance Claims</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-white/40 text-sm border-b border-white/10">
                      <th className="text-left py-3 px-4">Claim ID</th>
                      <th className="text-left py-3 px-4">Farmer</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Rainfall</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockInsuranceClaims.map((claim) => (
                      <tr key={claim.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-white font-mono">{claim.id}</td>
                        <td className="py-4 px-4 text-white">{claim.farmer}</td>
                        <td className="py-4 px-4 text-white/60">{claim.location}</td>
                        <td className="py-4 px-4">
                          <span className={claim.rainfall > claim.threshold ? 'text-red-400' : 'text-white'}>
                            {claim.rainfall}mm
                          </span>
                          <span className="text-white/40 text-sm"> / {claim.threshold}mm</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-emerald-400 font-medium">{claim.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
