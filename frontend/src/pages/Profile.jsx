import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, GraduationCap, Code, ExternalLink } from 'lucide-react';
import { userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingGfg, setSyncingGfg] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    branch: '',
    graduationYear: '',
    bio: '',
    targetRole: '',
    preferredLocation: ''
  });
  const [platformStats, setPlatformStats] = useState({
    leetcode: { totalSolved: 0, easy: 0, medium: 0, hard: 0, profileUrl: '' },
    gfg: { totalSolved: 0, school: 0, basic: 0, easy: 0, medium: 0, hard: 0, profileUrl: '' },
    codeforces: { rating: 0, problemsSolved: 0, handle: '' }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        college: data.college || '',
        branch: data.branch || '',
        graduationYear: data.graduationYear || '',
        bio: data.bio || '',
        targetRole: data.targetRole || '',
        preferredLocation: data.preferredLocation || ''
      });
      setPlatformStats(data.platformStats || platformStats);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userAPI.updateProfile(formData);
      updateUser(updated);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlatformSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userAPI.updatePlatformStats(platformStats);
      updateUser({ platformStats: updated });
    } catch (error) {
      console.error('Error updating platform stats:', error);
    } finally {
      setSaving(false);
    }
  };
  const syncGfg = async () => {
    setSyncingGfg(true);
    try { const gfg = await userAPI.syncGFG(platformStats.gfg.profileUrl); setPlatformStats((prev) => ({ ...prev, gfg })); updateUser({ platformStats: { ...platformStats, gfg } }); }
    catch (error) { alert(error.response?.data?.message || 'GFG sync failed.'); }
    finally { setSyncingGfg(false); }
  };

  const totalSolved = (platformStats.leetcode?.totalSolved || 0) + 
                      (platformStats.gfg?.totalSolved || 0) + 
                      (platformStats.codeforces?.problemsSolved || 0);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your personal information and coding profiles</p>
        </div>

        <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex">
              {['personal', 'platforms'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab === 'personal' ? 'Personal Info' : 'Coding Platforms'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'personal' ? (
              <form onSubmit={handlePersonalSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" /> Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Building2 className="w-4 h-4 inline mr-1" /> College
                    </label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({...formData, college: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <GraduationCap className="w-4 h-4 inline mr-1" /> Branch
                    </label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Graduation Year</label>
                    <input
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Role</label>
                    <input
                      type="text"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePlatformSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-orange-500" /> LeetCode
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Profile URL</label>
                      <input
                        type="url"
                        value={platformStats.leetcode.profileUrl}
                        onChange={(e) => setPlatformStats({
                          ...platformStats,
                          leetcode: {...platformStats.leetcode, profileUrl: e.target.value}
                        })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="https://leetcode.com/username"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['totalSolved', 'easy', 'medium', 'hard'].map(field => (
                        <div key={field}>
                          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1 capitalize">{field.replace('Solved', '')}</label>
                          <input
                            type="number"
                            value={platformStats.leetcode[field]}
                            onChange={(e) => setPlatformStats({
                              ...platformStats,
                              leetcode: {...platformStats.leetcode, [field]: parseInt(e.target.value) || 0}
                            })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="button" onClick={syncGfg} disabled={syncingGfg || !platformStats.gfg.profileUrl} className="mt-3 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{syncingGfg ? 'Syncing GFG…' : 'Sync GFG profile'}</button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-500" /> GeeksForGeeks
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Profile URL</label>
                      <input
                        type="url"
                        value={platformStats.gfg.profileUrl}
                        onChange={(e) => setPlatformStats({
                          ...platformStats,
                          gfg: {...platformStats.gfg, profileUrl: e.target.value}
                        })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['totalSolved', 'easy', 'medium', 'hard'].map(field => (
                        <div key={field}>
                          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1 capitalize">{field.replace('Solved', '')}</label>
                          <input
                            type="number"
                            value={platformStats.gfg[field]}
                            onChange={(e) => setPlatformStats({
                              ...platformStats,
                              gfg: {...platformStats.gfg, [field]: parseInt(e.target.value) || 0}
                            })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-500" /> Codeforces
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Handle</label>
                      <input
                        type="text"
                        value={platformStats.codeforces.handle}
                        onChange={(e) => setPlatformStats({
                          ...platformStats,
                          codeforces: {...platformStats.codeforces, handle: e.target.value}
                        })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Rating</label>
                      <input
                        type="number"
                        value={platformStats.codeforces.rating}
                        onChange={(e) => setPlatformStats({
                          ...platformStats,
                          codeforces: {...platformStats.codeforces, rating: parseInt(e.target.value) || 0}
                        })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Problems Solved</label>
                      <input
                        type="number"
                        value={platformStats.codeforces.problemsSolved}
                        onChange={(e) => setPlatformStats({
                          ...platformStats,
                          codeforces: {...platformStats.codeforces, problemsSolved: parseInt(e.target.value) || 0}
                        })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    Total Problems Solved: <span className="text-blue-600">{totalSolved}</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Platform Stats'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
