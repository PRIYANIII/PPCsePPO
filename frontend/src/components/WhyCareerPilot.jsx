const platforms = [
  {
    name: 'LeetCode',
    color: 'bg-orange-500',
    letter: 'L',
    description: 'For DSA Practice & contest tracking',
  },
  {
    name: 'LinkedIn',
    color: 'bg-blue-600',
    letter: 'in',
    description: 'For profile & network insights',
  },
  {
    name: 'GeeksforGeeks',
    color: 'bg-green-600',
    letter: 'G',
    description: 'For CS fundamentals & articles',
  },
  {
    name: 'ChatGPT',
    color: 'bg-emerald-500',
    letter: 'AI',
    description: 'For AI-powered coaching',
  },
];

export default function WhyCareerPilot() {
  return (
    <section className="py-20 bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Why CareerPilot?
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Students use 4 different platforms. We combine everything in one place.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-white dark:bg-[#131c31] rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md dark:hover:shadow-blue-900/10 transition-all"
            >
              <div
                className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-white font-bold text-sm mx-auto`}
              >
                {platform.letter}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                {platform.name}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {platform.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
