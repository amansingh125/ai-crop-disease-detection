import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Search, Filter, Trash2, Eye, RefreshCw, X, ShieldAlert, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { PredictionRecord, DashboardStats, Language } from '../types';
import { getTranslation } from '../translations';

interface DashboardProps {
  language: Language;
  onSelectRecord: (record: PredictionRecord) => void;
}

const COLORS = ['#3A5A40', '#588157', '#D4A373', '#A3B18A', '#BC8A5F', '#2D3436'];

export const Dashboard: React.FC<DashboardProps> = ({ language, onSelectRecord }) => {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Confirmation Modals State
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch history & stats from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.append('search', searchQuery);
      if (cropFilter !== 'all') query.append('crop', cropFilter);
      if (severityFilter !== 'all') query.append('severity', severityFilter);

      const [histRes, statsRes] = await Promise.all([
        fetch(`/api/history?${query.toString()}`),
        fetch('/api/stats')
      ]);

      const histData = await histRes.json();
      const statsData = await statsRes.json();

      if (histData.success) setRecords(histData.records);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, cropFilter, severityFilter]);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecordToDelete(id);
  };

  const confirmDeleteRecord = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/history/${recordToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== recordToDelete));
      }
      await fetchData();
    } catch (err) {
      console.error('Error deleting record:', err);
    } finally {
      setIsDeleting(false);
      setRecordToDelete(null);
    }
  };

  const confirmClearHistory = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (res.ok) {
        setRecords([]);
      }
      await fetchData();
    } catch (err) {
      console.error('Error clearing history:', err);
    } finally {
      setIsDeleting(false);
      setShowClearModal(false);
    }
  };

  const handleSeedSamples = async () => {
    try {
      await fetch('/api/seed-samples', { method: 'POST' });
      fetchData();
    } catch (err) {
      console.error('Error seeding samples:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E1D9] pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3A5A40] flex items-center gap-3 tracking-tight">
            <BarChart3 className="w-8 h-8 text-[#588157]" />
            {getTranslation(language, 'dashboardTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1">
            {getTranslation(language, 'dashboardSub')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-full bg-white border border-[#E8E1D9] text-[#2D3436] hover:bg-[#F8F9F8] transition-all shadow-2xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {getTranslation(language, 'clearHistoryBtn')}
          </button>
        </div>
      </div>

      {/* Overview Stat KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">
                {getTranslation(language, 'totalScans')}
              </p>
              <h3 className="text-3xl font-extrabold text-[#3A5A40] mt-1">
                {stats.totalScans}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0E6] text-[#3A5A40] flex items-center justify-center font-bold text-lg">
              📊
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">
                {getTranslation(language, 'diseasedCrops')}
              </p>
              <h3 className="text-3xl font-extrabold text-[#D4A373] mt-1">
                {stats.totalDiseased}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#D4A373] flex items-center justify-center font-bold text-lg">
              🍂
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">
                {getTranslation(language, 'healthyCrops')}
              </p>
              <h3 className="text-3xl font-extrabold text-[#588157] mt-1">
                {stats.totalHealthy}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0E6] text-[#588157] flex items-center justify-center font-bold text-lg">
              🌿
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {stats && stats.totalScans > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Type Breakdown Chart */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs">
            <h3 className="text-base font-bold text-[#3A5A40] mb-4">
              {getTranslation(language, 'cropChartTitle')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.cropBreakdown}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats.cropBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Distribution Chart */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs">
            <h3 className="text-base font-bold text-[#3A5A40] mb-4">
              {getTranslation(language, 'severityChartTitle')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.severityBreakdown}>
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3A5A40" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7F8C8D] absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation(language, 'searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8E1D9] text-sm text-[#2D3436] bg-[#F8F9F8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5A40]"
            />
          </div>

          {/* Crop Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-[#7F8C8D] absolute left-4 top-3.5" />
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8E1D9] text-sm bg-[#F8F9F8] text-[#2D3436] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5A40]"
            >
              <option value="all">{getTranslation(language, 'filterCropAll')}</option>
              <option value="tomato">Tomato</option>
              <option value="potato">Potato</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="apple">Apple</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-[#E8E1D9] text-sm bg-[#F8F9F8] text-[#2D3436] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5A40]"
            >
              <option value="all">{getTranslation(language, 'filterSevAll')}</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="none">Healthy (None)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Records History Grid / Table */}
      {records.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E1D9] shadow-xs">
          <p className="text-[#7F8C8D] text-sm mb-4">
            {getTranslation(language, 'noHistory')}
          </p>
          <button
            onClick={handleSeedSamples}
            className="px-6 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#344E41] text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Load Sample Demonstration Records
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectRecord(rec)}
              className="bg-white rounded-3xl border border-[#E8E1D9] shadow-xs hover:border-[#A3B18A] hover:shadow-md transition-all cursor-pointer overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-[#F8F9F8] border-b border-[#E8E1D9] overflow-hidden">
                  <img
                    src={rec.imagePreview}
                    alt={rec.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      rec.severity === 'High' ? 'bg-red-500 text-white' :
                      rec.severity === 'Medium' ? 'bg-[#D4A373] text-white' :
                      rec.severity === 'Low' ? 'bg-yellow-500 text-slate-900' : 'bg-[#3A5A40] text-white'
                    }`}>
                      {rec.severity}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-[#7F8C8D] mb-1">
                    <span className="font-bold text-[#3A5A40] uppercase tracking-wider">
                      {rec.cropName}
                    </span>
                    <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                  </div>

                  <h4 className="font-bold text-[#2D3436] text-base line-clamp-1">
                    {rec.diseaseName}
                  </h4>

                  <p className="text-xs text-[#7F8C8D] mt-2 line-clamp-2 leading-relaxed">
                    {rec.analysis?.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#E8E1D9] text-xs">
                <span className="text-[#3A5A40] font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {getTranslation(language, 'viewDetails')}
                </span>

                <button
                  onClick={(e) => handleDeleteClick(rec.id, e)}
                  className="p-1.5 rounded-lg text-[#7F8C8D] hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Single Record Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#E8E1D9] space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2D3436]">Delete Scan Record</h3>
            </div>
            
            <p className="text-xs sm:text-sm text-[#7F8C8D] leading-relaxed">
              Are you sure you want to delete this scan record? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 rounded-full border border-[#E8E1D9] text-xs font-bold text-[#2D3436] hover:bg-[#F8F9F8] transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDeleteRecord}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {isDeleting ? 'Deleting...' : 'Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#E8E1D9] space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#2D3436]">Clear All Scan History</h3>
            </div>
            
            <p className="text-xs sm:text-sm text-[#7F8C8D] leading-relaxed">
              {getTranslation(language, 'confirmClear')}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-full border border-[#E8E1D9] text-xs font-bold text-[#2D3436] hover:bg-[#F8F9F8] transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmClearHistory}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {isDeleting ? 'Clearing...' : 'Clear All History'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
