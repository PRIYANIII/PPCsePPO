const companies = [
  { name: 'JP Morgan', score: 74, color: 'bg-green-500', letter: 'J' },
  { name: 'Oracle', score: 68, color: 'bg-red-500', letter: 'O' },
  { name: 'Deloitte', score: 82, color: 'bg-teal-500', letter: 'D' },
  { name: 'Barclays', score: 61, color: 'bg-blue-500', letter: 'B' },
  { name: 'Accenture', score: 77, color: 'bg-purple-500', letter: 'A' },
];

const experiences = [
  {
    company: 'JP Morgan',
    letter: 'J',
    color: 'bg-blue-600',
    rounds: ['OA Round', 'Technical Round', 'HR Round'],
    topics: ['Arrays', 'SQL', 'System Design'],
    result: 'Selected',
  },
  {
    company: 'Deloitte',
    letter: 'D',
    color: 'bg-green-600',
    rounds: ['Aptitude', 'Technical', 'Managerial'],
    topics: ['Java', 'DBMS', 'OOP'],
    result: 'Selected',
  },
  {
    company: 'Oracle',
    letter: 'O',
    color: 'bg-red-600',
    rounds: ['Online Test', 'Technical', 'HR'],
    topics: ['DSA', 'OS', 'Networks'],
    result: 'Selected',
  },
];

export default function DataSection() {
  return (
    <section
      id="companies"
      className="py-20 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div
            id="experiences"
            className="bg-white dark:bg-[#131c31] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-sm"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Track Readiness Across Companies
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Monitor your placement readiness for each target company
            </p>

            <div className="mt-6 space-y-5">
              {companies.map((company) => (
                <div key={company.name} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {company.letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {company.name}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {company.score}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${company.color} rounded-full transition-all`}
                        style={{ width: `${company.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#131c31] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Real Interview Experiences
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Learn from students who cracked top companies
            </p>

            <div className="mt-6 space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.company}
                  className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${exp.color} rounded-lg flex items-center justify-center text-white font-bold`}
                    >
                      {exp.letter}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {exp.company}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {exp.rounds.join(' · ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                      Result: {exp.result}
                    </span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
