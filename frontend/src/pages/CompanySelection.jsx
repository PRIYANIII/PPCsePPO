import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, ArrowRight, Check, Plus, X } from 'lucide-react';
import { companyAPI, userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CompanySelection() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyAPI.getAll();
      setCompanies(data);
      // Pre-select user's existing company readiness
      if (user?.companyReadiness) {
        setSelectedCompanies(user.companyReadiness.map(cr => cr.companyId));
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (companyId) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const companyId of selectedCompanies) {
        const company = companies.find(c => c._id === companyId);
        await userAPI.updateCompanyReadiness({
          companyId,
          readinessData: {
            companyName: company.name,
            overallScore: 0,
            dsaScore: 0,
            csFundamentalsScore: 0,
            aptitudeScore: 0,
            topicsToFocus: []
          }
        });
      }
      const updatedProfile = await userAPI.getProfile();
      updateUser(updatedProfile);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving companies:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Select Your Target Companies
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Choose the companies visiting your campus for placement. We'll create a personalized preparation plan for each.
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {selectedCompanies.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Selected Companies ({selectedCompanies.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedCompanies.map(id => {
                const company = companies.find(c => c._id === id);
                return company ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    <Building2 className="w-3 h-3" />
                    {company.name}
                    <button onClick={() => toggleCompany(id)} className="ml-1 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredCompanies.map(company => (
            <button
              key={company._id}
              onClick={() => toggleCompany(company._id)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                selectedCompanies.includes(company._id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {selectedCompanies.includes(company._id) && (
                <div className="absolute top-3 right-3">
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
              )}
              <Building2 className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {company.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {company.averagePackage} avg
              </p>
              {company.recruitmentProcess && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {company.recruitmentProcess.totalRounds} rounds
                </p>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selectedCompanies.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save & Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}