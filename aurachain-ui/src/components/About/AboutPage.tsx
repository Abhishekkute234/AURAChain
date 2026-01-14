// aurachain-ui/src/components/About/AboutPage.tsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from "@studio-freight/lenis";
import { 
  ArrowLeft, 
  InfinityIcon, 
  Github, 
  Linkedin, 
  Code2, 
  Database, 
  Music, 
  Globe
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import ThemeToggle from '../Shared/ThemeToggle';

export default function AboutPage() {
  const { isDarkMode } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-light-bg dark:bg-black min-h-screen text-slate-900 dark:text-zinc-100 font-sans selection:bg-primary selection:text-white transition-colors duration-500"
    >
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <header className="fixed top-0 w-full z-50 border-b border-light-border dark:border-zinc-800 bg-light-bg/90 dark:bg-black/90 backdrop-blur-sm transition-colors duration-300">
        <div className="flex justify-between items-center h-16 px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <InfinityIcon size={30} className="text-primary group-hover:rotate-180 transition-transform duration-700" strokeWidth={2.5} /> 
              <span className="font-heading font-bold tracking-tight text-lg text-slate-900 dark:text-white">
                AURACHAIN
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              to="/app"
              className="px-5 py-2 bg-primary text-white text-xs font-bold font-mono uppercase tracking-wider hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
            >
              Console
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-accent-slate dark:text-zinc-500 mb-12 hover:text-primary transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> BACK_TO_BASE
        </Link>

        <section className="mb-24">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight">
            Forged in the hustle <br />
            <span className="text-primary">of Mumbai.</span>
          </h1>

          <div className="prose dark:prose-invert max-w-2xl">
            <p className="text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
              Aurachain was born out of a simple observation: India's 63 million MSMEs run the economy, 
              but they run it on instinct, not intelligence.
            </p>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-zinc-400 mt-4">
              Built over a sleepless weekend by two engineers, this platform aims to bridge the gap between 
              local commerce and global-grade AI. We did not want to build only a dashboard; we wanted to build 
              an operating system for the unorganized sector.
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-10 border-b border-light-border dark:border-zinc-800 pb-4">
            <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded text-slate-900 dark:text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-mono font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">The Builders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group">
              <div className="mb-6 relative overflow-hidden bg-slate-100 dark:bg-zinc-900 aspect-[4/3] border border-light-border dark:border-zinc-800 rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:scale-105 transition-transform duration-700" />

                <img
                  src="/Partho.jpg"
                  alt="Partho Mal"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 hover:opacity-100"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                  <Music className="w-8 h-8 text-white drop-shadow-md opacity-80" />
                </div>
              </div>

              <h3 className="text-2xl font-bold font-heading mb-1">Partho Mal</h3>
              <p className="text-xs font-mono text-primary mb-4 uppercase tracking-wider">Frontend Architect and UX</p>

              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
                A full stack engineer with a producer's ear for detail. Partho blends technical expertise in Go and React 
                with a passion for ambient music production. For Aurachain, he crafted the visual experience, ensuring complex 
                multi agent data feels intuitive and human.
              </p>

              <div className="flex gap-4">
                <a href="https://github.com/Partho-Mal" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                <a href="https://linkedin.com/in/parthomal" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="https://parthomal.vercel.app" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors"><Globe className="w-5 h-5" /></a>
              </div>
            </div>

            <div className="group">
              <div className="mb-6 relative overflow-hidden bg-slate-100 dark:bg-zinc-900 aspect-[4/3] border border-light-border dark:border-zinc-800 rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 group-hover:scale-105 transition-transform duration-700" />

                <img
                  src="/Moin.jpg"
                  alt="Moin Ansari"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 hover:opacity-100"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                  <Database className="w-8 h-8 text-white drop-shadow-md opacity-80" />
                </div>
              </div>

              <h3 className="text-2xl font-bold font-heading mb-1">Moin Ansari</h3>
              <p className="text-xs font-mono text-emerald-500 mb-4 uppercase tracking-wider">Backend Lead and AI</p>

              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
                An AI and data science specialist with deep roots in mobile and backend systems. Moin architected the 
                intelligence layer of Aurachain, designing the multi agent orchestration and predictive models that power 
                the supply chain logic.
              </p>

              <div className="flex gap-4">
                <a
                  href="https://github.com/Moin333"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/moin-ansari-7861m/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 pt-12 border-t border-light-border dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-xs font-mono text-slate-500 dark:text-zinc-600">
              <span className="block mb-1">BUILT WITH:</span>
              REACT 19 • FASTAPI • DOCKER • REDIS
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-zinc-600">
              MUMBAI, INDIA // {new Date().getFullYear()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
