import { useNavigate } from 'react-router-dom';
import { BookOpen, Building2, Code2, Flame, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const progress = user?.dsaProgress || [];
  const solved = progress.reduce((sum, topic) => sum + (topic.solvedQuestions || 0), 0);
  const total = user?.totalDSAQuestions || progress.reduce((sum, topic) => sum + (topic.totalQuestions || 0), 0);
  const platformSolved = ['leetcode', 'gfg'].reduce(
    (sum, platform) => sum + (user?.platformStats?.[platform]?.totalSolved || 0),
    user?.platformStats?.codeforces?.problemsSolved || 0
  );
  const readiness = user?.companyReadiness?.length
    ? Math.round(user.companyReadiness.reduce((sum, company) => sum + (company.overallScore || 0), 0) / user.companyReadiness.length)
    : 0;
  const percent = total ? Math.round((solved / total) * 100) : 0;
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {firstName}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Keep building momentum toward your next placement.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Metric icon={Target} label="DSA progress" value={`${solved} / ${total}`} detail={`${percent}% complete`} color="blue" />
        <Metric icon={Code2} label="Platform problems" value={platformSolved} detail="LeetCode, GFG & Codeforces" color="green" />
        <Metric icon={Flame} label="Study streak" value={`${user?.studyStreak?.current || 0} days`} detail={`Best: ${user?.studyStreak?.longest || 0} days`} color="orange" />
        <Metric icon={Building2} label="Company readiness" value={`${readiness}%`} detail={user?.companyReadiness?.length ? `${user.companyReadiness.length} company plan(s)` : 'Choose a company to begin'} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <section className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div><h2 className="font-semibold text-slate-900 dark:text-white">Your DSA journey</h2><p className="text-sm text-slate-500">Practice consistently to improve.</p></div>
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-500">{solved} solved of {total || 'your available'} questions</p>
          <button onClick={() => navigate('/dsa')} className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Continue practicing</button>
        </section>

        <section className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white">Next best steps</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Action done={Boolean(user?.college)} text="Complete your academic profile" onClick={() => navigate('/profile')} />
            <Action done={platformSolved > 0} text="Add your coding-platform progress" onClick={() => navigate('/profile')} />
            <Action done={solved > 0} text="Solve your first DSA problem" onClick={() => navigate('/dsa')} />
            <Action done={Boolean(user?.companyReadiness?.length)} text="Explore a target company" onClick={() => navigate('/companies')} />
          </div>
        </section>
      </div>

      <section className="mt-6 bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-900 dark:text-white">Progression chart</h2><p className="text-sm text-slate-500">Solved questions by DSA topic.</p></div><span className="text-sm font-semibold text-blue-600">{percent}% overall</span></div>
        {progress.length ? <div className="mt-5 space-y-4">{progress.map((topic) => { const value = topic.totalQuestions ? Math.round((topic.solvedQuestions || 0) / topic.totalQuestions * 100) : 0; return <div key={topic._id || topic.topicId}><div className="flex justify-between text-sm mb-1"><span className="text-slate-700 dark:text-slate-300 truncate max-w-[75%]">{topic.topicName}</span><span className="text-slate-500">{topic.solvedQuestions || 0}/{topic.totalQuestions || 0}</span></div><div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${value}%` }} /></div></div>; })}</div> : <div className="mt-5 py-8 text-center text-slate-500">Solve a DSA problem to begin building your chart.</div>}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail, color }) {
  const colors = { blue: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', green: 'text-green-500 bg-green-50 dark:bg-green-500/10', orange: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10', purple: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' };
  return <div className="bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}><Icon className="w-5 h-5" /></div><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function Action({ done, text, onClick }) {
  return <button onClick={onClick} className="w-full flex items-center gap-3 text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"><span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>{done ? '✓' : ''}</span><span className={done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}>{text}</span></button>;
}
