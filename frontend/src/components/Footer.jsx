import { Link } from 'react-router-dom';
import { Rocket, Twitter, Linkedin, Instagram, Github, Send } from 'lucide-react';

export default function Footer() {
  const productLinks = ['Features', 'Companies', 'AI Coach', 'Roadmap'];
  const resourceLinks = [
    'Interview Experiences',
    'Blog',
    'Guides',
    'FAQs',
  ];
  const companyLinks = [
    'About Us',
    'Contact Us',
    'Privacy Policy',
    'Terms of Service',
  ];

  return (
    <footer className="bg-slate-900 dark:bg-[#070d19] text-slate-400 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <Rocket className="w-6 h-6 text-blue-500" />
              CareerPilot
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Your AI-powered placement coach. Get ready for your dream company
              with personalized roadmaps and insights.
            </p>
            <div className="mt-6 flex gap-4">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for placement tips and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-slate-800 dark:bg-[#0b1120] border border-slate-700 rounded-l-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 py-2.5 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © 2025 CareerPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
