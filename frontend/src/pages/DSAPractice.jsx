import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronDown, CheckCircle2, Circle, Play, 
  BookOpen, Search, Filter, ArrowLeft, BarChart3 
} from 'lucide-react';
import { dsaAPI, userAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DSAPractice() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    loadTopics();
    loadProgress();
  }, []);

  useEffect(() => {
    if (topicId) {
      loadQuestions(topicId);
    }
  }, [topicId]);

  const loadTopics = async () => {
    try {
      const data = await dsaAPI.getTopics();
      setTopics(data);
      if (topicId) {
        setSelectedTopic(data.find(t => t._id === topicId));
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await userAPI.getDSAProgress();
      setUserProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadQuestions = async (id) => {
    try {
      const data = await dsaAPI.getQuestionsByTopic(id);
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const getTopicProgress = (topicId) => {
    if (!userProgress) return { solved: 0, total: 0 };
    const progress = userProgress.find(p => p.topicId === topicId || p.topicId?._id === topicId);
    return {
      solved: progress?.solvedQuestions || 0,
      total: progress?.totalQuestions || 0
    };
  };

  const getQuestionStatus = (questionId) => {
    if (!userProgress || !selectedTopic) return 'not_started';
    const topicProgress = userProgress.find(
      p => p.topicId === selectedTopic._id || p.topicId?._id === selectedTopic._id
    );
    if (!topicProgress) return 'not_started';
    const qProgress = topicProgress.questions?.find(q => q.questionId === questionId);
    return qProgress?.status || 'not_started';
  };

  const getOverallStats = () => {
    if (!userProgress) return { solved: 0, total: topics.reduce((sum, topic) => sum + (topic.totalQuestions || 0), 0), easySolved: 0, mediumSolved: 0, hardSolved: 0 };
    return userProgress.reduce((acc, topic) => ({
      solved: acc.solved + (topic.solvedQuestions || 0),
      total: acc.total + (topic.totalQuestions || 0),
      easySolved: acc.easySolved + (topic.easySolved || 0),
      mediumSolved: acc.mediumSolved + (topic.mediumSolved || 0),
      hardSolved: acc.hardSolved + (topic.hardSolved || 0)
    }), { solved: 0, total: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 });
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    navigate(`/dsa/topic/${topic._id}`);
    loadQuestions(topic._id);
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const statusIcons = {
    solved: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    attempted: <Circle className="w-5 h-5 text-yellow-500" />,
    revision: <BookOpen className="w-5 h-5 text-purple-500" />,
    not_started: <Circle className="w-5 h-5 text-slate-300" />
  };

  const difficultyColors = {
    easy: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    hard: 'text-red-500 bg-red-50 dark:bg-red-900/20'
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] pt-16 flex">
      <aside className="hidden lg:flex flex-col w-80 bg-white dark:bg-[#131c31] border-r border-slate-200 dark:border-slate-700 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">DSA Sheet</h2>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-lg font-bold text-blue-600">{stats.solved}</p>
              <p className="text-xs text-slate-500">Solved</p>
            </div>
            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-lg font-bold text-green-600">{stats.easySolved}</p>
              <p className="text-xs text-slate-500">Easy</p>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-lg font-bold text-yellow-600">{stats.mediumSolved}</p>
              <p className="text-xs text-slate-500">Med</p>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-lg font-bold text-red-600">{stats.hardSolved}</p>
              <p className="text-xs text-slate-500">Hard</p>
            </div>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${stats.total > 0 ? (stats.solved / stats.total) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stats.solved} / {stats.total} solved ({stats.total ? Math.round((stats.solved / stats.total) * 100) : 0}%)
          </p>
        </div>
        
        <nav className="flex-1 py-2">
          {topics.map(topic => {
            const progress = getTopicProgress(topic._id);
            return (
              <div key={topic._id}>
                <button
                  onClick={() => handleTopicClick(topic)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                    selectedTopic?._id === topic._id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-left flex-1 truncate">{topic.name}</span>
                  <span className="text-xs text-slate-500 ml-2">
                    {progress.solved}/{topic.totalQuestions}
                  </span>
                </button>
                {topic.subTopics?.length > 0 && (
                  <div className="ml-4">
                    {topic.subTopics.map(sub => (
                      <button
                        key={sub._id}
                        className="w-full text-left px-4 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {!selectedTopic ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select a topic to start practicing
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Choose from the topics on the left to view questions
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => { setSelectedTopic(null); navigate('/dsa'); }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedTopic.name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {getTopicProgress(selectedTopic._id).solved} / {selectedTopic.totalQuestions} solved
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              {questions
                .filter(q => difficultyFilter === 'all' || q.difficulty === difficultyFilter)
                .filter(q => !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(question => (
                  <div
                    key={question._id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {statusIcons[getQuestionStatus(question._id)]}
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {question.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[question.difficulty]}`}>
                            {question.difficulty}
                          </span>
                          {question.companies?.slice(0, 3).map(company => (
                            <span key={company} className="text-xs text-slate-400">
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/code/${question._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Solve
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
