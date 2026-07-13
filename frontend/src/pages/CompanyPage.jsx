import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, TrendingUp, Target, BookOpen, Users, 
  DollarSign, Award, ArrowLeft, Star, Clock, CheckCircle2 
} from 'lucide-react';
import { companyAPI, userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CompanyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      const data = await companyAPI.getOne(id);
      setCompany(data.company);
      setReadiness(data.userReadiness);
    } catch (error) {
      console.error('Error loading company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Company not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </button>

        {/* Company Header */}
        <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {company.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {company.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Avg: {company.averagePackage}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Highest: {company.highestPackage}
                </div>
              </div>
            </div>

            {readiness && (
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl min-w-[140px]">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#334155" strokeWidth="2" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none" stroke="#3b82f6" strokeWidth="2"
                      strokeDasharray={`${readiness.overallScore} 100`} strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900 dark:text-white">
                    {readiness.overallScore}%
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Readiness</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex">
              {['overview', 'process', 'skills', 'experiences'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Available Roles</h3>
                    <div className="space-y-2">
                      {company.roles?.map((role, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 dark:text-slate-300">{role.title}</span>
                          <span className="text-slate-500">{role.package}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Skill Weights</h3>
                    <div className="space-y-3">
                      {Object.entries(company.skillWeights || {}).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{value}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'process' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recruitment Process</h3>
                {company.recruitmentProcess?.rounds?.map((round, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{round.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{round.description}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full capitalize">
                        {round.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && readiness?.topicsToFocus && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Topics to Focus</h3>
                {readiness.topicsToFocus.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Target className={`w-5 h-5 ${
                        topic.priority === 'high' ? 'text-red-500' :
                        topic.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                      }`} />
                      <span className="text-slate-700 dark:text-slate-300">{topic.topic}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">{topic.estimatedHours}h</span>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        topic.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
                        topic.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' :
                        'bg-green-50 dark:bg-green-900/20 text-green-600'
                      }`}>
                        {topic.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'experiences' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Interview Experiences</h3>
                {company.interviewExperiences?.map((exp, index) => (
                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-900 dark:text-white">{exp.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{exp.role}</span>
                        {exp.selected && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{exp.experience}</p>
                    {exp.rounds?.map((round, rIndex) => (
                      <div key={rIndex} className="ml-4 mb-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {round.roundType}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {round.questions?.map((q, qIndex) => (
                            <span key={qIndex} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {(!company.interviewExperiences || company.interviewExperiences.length === 0) && (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No interview experiences shared yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}