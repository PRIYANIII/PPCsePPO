import { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, BookOpen, Code2, 
  Building2, Users, FileText, ChevronDown, ChevronRight 
} from 'lucide-react';
import { adminAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('topics');
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await adminAPI.getStats();
      setStats(statsData);
      
      if (activeSection === 'topics') {
        const { dsaAPI } = await import('../api/client');
        const topicsData = await dsaAPI.getPublicTopics();
        setTopics(topicsData);
      } else if (activeSection === 'companies') {
        const { companyAPI } = await import('../api/client');
        const companiesData = await companyAPI.getAll();
        setCompanies(companiesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(activeSection === 'topics' ? {
      name: '',
      slug: '',
      category: 'arrays',
      difficulty: 'beginner',
      subTopics: []
    } : {
      name: '',
      description: '',
      averagePackage: '',
      highestPackage: ''
    });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (activeSection === 'topics') {
        if (editingItem) {
          await adminAPI.updateTopic(editingItem._id, formData);
        } else {
          await adminAPI.createTopic(formData);
        }
      } else if (activeSection === 'companies') {
        if (editingItem) {
          await adminAPI.updateCompany(editingItem._id, formData);
        } else {
          await adminAPI.createCompany(formData);
        }
      }
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (activeSection === 'topics') {
        await adminAPI.deleteTopic(id);
      }
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const sections = [
    { id: 'topics', label: 'DSA Topics', icon: BookOpen },
    { id: 'questions', label: 'Questions', icon: Code2 },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#131c31] rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-sm text-slate-500">Total Users</p>
            </div>
            <div className="bg-white dark:bg-[#131c31] rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <Code2 className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalQuestions}</p>
              <p className="text-sm text-slate-500">Questions</p>
            </div>
            <div className="bg-white dark:bg-[#131c31] rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <BookOpen className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalTopics}</p>
              <p className="text-sm text-slate-500">Topics</p>
            </div>
            <div className="bg-white dark:bg-[#131c31] rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <Building2 className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalCompanies}</p>
              <p className="text-sm text-slate-500">Companies</p>
            </div>
          </div>
        )}

        {/* Section Navigation */}
        <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              {activeSection !== 'users' && (
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              )}
            </div>

            {/* Topics List */}
            {activeSection === 'topics' && (
              <div className="space-y-2">
                {topics.map(topic => (
                  <div
                    key={topic._id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{topic.name}</h3>
                      <p className="text-sm text-slate-500">
                        {topic.totalQuestions} questions • {topic.subTopics?.length || 0} sub-topics
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(topic._id)}
                        className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Companies List */}
            {activeSection === 'companies' && (
              <div className="space-y-2">
                {companies.map(company => (
                  <div
                    key={company._id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">{company.name}</h3>
                        <p className="text-sm text-slate-500">{company.averagePackage} avg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(company)}
                        className="p-2 text-slate-500 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users List */}
            {activeSection === 'users' && stats?.recentUsers && (
              <div className="space-y-2">
                {stats.recentUsers.map(user => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">
                          {user.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Question Section */}
            {activeSection === 'questions' && (
              <div className="text-center py-8">
                <Code2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Question Management
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Select a topic first, then add questions with test cases
                </p>
                <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300">
                  <option value="">Select a topic...</option>
                  {topics.map(topic => (
                    <option key={topic._id} value={topic._id}>{topic.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingItem ? 'Edit' : 'Create'} {activeSection === 'topics' ? 'Topic' : 'Company'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {activeSection === 'topics' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Slug</label>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                        <select
                          value={formData.category || 'arrays'}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        >
                          <option value="arrays">Arrays</option>
                          <option value="strings">Strings</option>
                          <option value="linked_list">Linked List</option>
                          <option value="trees">Trees</option>
                          <option value="graphs">Graphs</option>
                          <option value="dp">Dynamic Programming</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                        <select
                          value={formData.difficulty || 'beginner'}
                          onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Average Package</label>
                        <input
                          type="text"
                          value={formData.averagePackage || ''}
                          onChange={(e) => setFormData({...formData, averagePackage: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Highest Package</label>
                        <input
                          type="text"
                          value={formData.highestPackage || ''}
                          onChange={(e) => setFormData({...formData, highestPackage: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}