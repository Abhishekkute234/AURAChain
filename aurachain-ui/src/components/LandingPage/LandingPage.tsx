// aurachain-ui/src/components/LandingPage/LandingPage.tsx
import { useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  LineChart, 
  Database, 
  Layers, 
  BrainCircuit, 
  ArrowRight, 
  Github, 
  InfinityIcon,
  Briefcase,
  Network
} from "lucide-react";

// --- Integrations ---
import { useUIStore } from '../../store/uiStore'; 
import ThemeToggle from '../Shared/ThemeToggle'; 

// Register GSAP
gsap.registerPlugin(ScrollTrigger);

// Utility for cleaner tailwind classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Data ---
const AGENTS = [
  {
    id: "01",
    title: "Orchestrator",
    model: "Claude 3.5 Sonnet",
    role: "CONTROLLER",
    desc: "Central intelligence unit. Interprets NL queries, decomposes tasks, and manages the execution plan.",
    icon: <BrainCircuit className="w-5 h-5" />,
  },
  {
    id: "02",
    title: "Trend Analyst",
    model: "Gemini 2.0 Flash",
    role: "ANALYTICS",
    desc: "High-speed pattern recognition engine. Detects seasonality and hidden correlations in milliseconds.",
    icon: <LineChart className="w-5 h-5" />,
  },
  {
    id: "03",
    title: "Data Harvester",
    model: "Gemini 1.5 Flash",
    role: "INGESTION",
    desc: "ETL pipeline specialist. Sanitizes and normalizes incoming CSV/JSON streams for processing.",
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "04",
    title: "MCTS Optimizer",
    model: "Claude 3.5 Sonnet",
    role: "STRATEGY",
    desc: "Decision tree search engine. Simulates thousands of future scenarios to find optimal business paths.",
    icon: <Layers className="w-5 h-5" />,
  }
];

const METRICS = [
  { label: "Active Agents", value: "08" },
  { label: "LLM Providers", value: "03" },
  { label: "Avg Latency", value: "98ms" },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useUIStore();

  // Sync Dark Mode manually for GSAP/Lenis context
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  // Lenis Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Marquee Animation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 30,
          repeat: -1,
        });
      }

      // 2. Reveal Grid Lines
      gsap.utils.toArray<HTMLElement>(".border-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
          },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.5,
          ease: "expo.out"
        });
      });

      // 3. Hero Text Stagger
      gsap.from(".hero-char", {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "bg-light-bg dark:bg-black min-h-screen text-slate-900 dark:text-zinc-100",
        "font-sans selection:bg-primary selection:text-white transition-colors duration-500"
      )}
    >
      
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.15]" 
           style={{ 
             backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }} 
      />

      {/* --- Header --- */}
      <header className="fixed top-0 w-full z-50 border-b border-light-border dark:border-zinc-800 bg-light-bg/90 dark:bg-black/90 backdrop-blur-sm transition-colors duration-300">
        <div className="flex justify-between items-center h-16 px-6">
          
          {/* Logo Section - ANIMATION FIXED HERE */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <InfinityIcon 
              size={30} 
              className="text-primary transition-transform duration-700 ease-in-out group-hover:rotate-180" 
              strokeWidth={2.5} 
            /> 
            <span className="font-heading font-bold tracking-tight text-lg text-slate-900 dark:text-white">
              AURACHAIN
              <span className="text-accent-slate dark:text-zinc-500 font-normal ml-1 text-sm font-mono">v1.0</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 mr-2 border-r border-light-border dark:border-zinc-800 pr-6 h-6">
              <Link 
                to="/business-model" 
                className="text-[13px] font-mono font-bold text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary border border-slate-400 dark:border-zinc-600 transition-colors"></span>
                Business Model
              </Link>
              <Link 
                to="/about" 
                className="text-[13px] font-mono font-bold text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary border border-slate-400 dark:border-zinc-600 transition-colors"></span>
                About
              </Link>
            </nav>

            <a 
              href="https://github.com/Moin333/TEAM-LEVI-MUMBAIHACKS" 
              target="_blank" 
              rel="noreferrer" 
              className="hidden md:flex items-center gap-2 text-xs font-mono text-accent-slate dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="uppercase tracking-wide">Source</span>
            </a>
            
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

      {/* --- Hero --- */}
      <section className="relative pt-32 pb-20 px-6 border-b border-light-border dark:border-zinc-800">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-8 flex items-center gap-2 text-xs font-mono text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            SYSTEM_STATUS: ONLINE
          </div>

          <h1 className="font-heading text-6xl md:text-8xl lg:text-[8rem] font-bold leading-[0.9] tracking-tight mb-12 text-slate-900 dark:text-white">
            <div className="overflow-hidden"><span className="hero-char block">MULTI-AGENT</span></div>
            <div className="overflow-hidden"><span className="hero-char block text-primary-300 dark:text-primary-600/80">INTELLIGENCE</span></div>
            <div className="overflow-hidden"><span className="hero-char block">PLATFORM</span></div>
          </h1>

          <div className="flex flex-col md:flex-row items-end justify-between gap-12 max-w-6xl">
            <p className="text-lg md:text-xl max-w-xl leading-relaxed text-accent-slate dark:text-zinc-400 font-sans">
              A production-grade orchestration layer for MSME analytics. 
              Deploys 8 specialized autonomous agents using the <span className="text-slate-900 dark:text-white font-semibold underline decoration-light-border dark:decoration-zinc-700 underline-offset-4">Model Context Protocol</span> to forecast revenue and optimize operations.
            </p>
            
            <div className="flex gap-4 w-full md:w-auto">
              <Link 
                to="/app" 
                className="group relative flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 overflow-hidden font-mono text-lg font-bold uppercase tracking-widest transition-all duration-300 border-2 border-slate-900 dark:border-zinc-100 text-slate-900 dark:text-white hover:border-primary dark:hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                <span className="absolute inset-0 w-full h-full bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></span>
                <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-white">
                  INITIALIZE_SYSTEM 
                  <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-100 group-hover:text-white transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-100 group-hover:text-white transition-colors duration-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Marquee --- */}
      <div className="relative z-20 border-b border-light-border dark:border-zinc-800 overflow-hidden bg-light-surface dark:bg-zinc-900 py-3">
        <div ref={marqueeRef} className="flex whitespace-nowrap text-3xl md:text-5xl font-heading font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-tight select-none">
          <span>Production Ready /// FastAPI + Docker + Redis /// Multi-Model /// </span>
          <span>Production Ready /// FastAPI + Docker + Redis /// Multi-Model /// </span>
          <span>Production Ready /// FastAPI + Docker + Redis /// Multi-Model /// </span>
        </div>
      </div>

      {/* --- Agents Grid --- */}
      <section className="bg-light-bg dark:bg-black">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-4 p-8 border-b border-light-border dark:border-zinc-800">
            <h2 className="text-xs font-mono text-primary mb-2">01 // AGENT_ECOSYSTEM</h2>
            <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Autonomous Worker Nodes</h3>
          </div>

          {AGENTS.map((agent, i) => (
            <div 
              key={i} 
              className={cn(
                "group relative border-b border-r border-light-border dark:border-zinc-800",
                "p-8 h-[400px] flex flex-col justify-between bg-light-bg dark:bg-black",
                "transition-colors hover:bg-light-surface dark:hover:bg-zinc-900"
              )}
            >
              <div className="border-reveal absolute top-0 left-0 w-full h-[2px] bg-primary z-10" />
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 flex items-center justify-center border border-light-border dark:border-zinc-700 bg-light-elevated dark:bg-zinc-900 text-primary">
                    {agent.icon}
                  </div>
                  <span className="font-mono text-xs text-accent-slate dark:text-zinc-500">{agent.id}</span>
                </div>
                <h4 className="text-xl font-heading font-bold mb-2 text-slate-900 dark:text-zinc-100">{agent.title}</h4>
                <div className="inline-block px-2 py-1 bg-light-elevated dark:bg-zinc-900 text-[10px] font-mono uppercase tracking-widest text-accent-slate dark:text-zinc-400 mb-4 border border-light-border dark:border-zinc-700">
                  {agent.model}
                </div>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {agent.desc}
                </p>
              </div>
              <div className="pt-6 border-t border-dashed border-light-border dark:border-zinc-800 mt-auto flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
                <span className="text-[10px] font-mono font-bold text-accent-teal tracking-widest uppercase">
                  ACTIVE
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Technical Specs & Architecture --- */}
      <section className="flex flex-col lg:flex-row border-b border-light-border dark:border-zinc-800">
        <div className="lg:w-1/3 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-light-border dark:border-zinc-800 bg-light-bg dark:bg-black">
          <h2 className="text-xs font-mono text-primary mb-2">02 // ARCHITECTURE</h2>
          <h3 className="text-4xl font-heading font-bold mb-10 text-slate-900 dark:text-white">Hub & Spoke<br/>Intelligence</h3>
          
          <div className="space-y-0">
            {METRICS.map((m, i) => (
               <div key={i} className="flex justify-between items-end border-b border-light-border dark:border-zinc-800 py-4">
                 <span className="text-sm text-accent-slate dark:text-zinc-500 font-mono uppercase tracking-wide">{m.label}</span>
                 <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{m.value}</span>
               </div>
            ))}
          </div>
        </div>

        {/* --- Visual Architecture (Updated Diagram) --- */}
        <div className="lg:w-2/3 bg-light-surface dark:bg-zinc-950 p-8 lg:p-12 flex items-center justify-center overflow-hidden relative">
          
          <div className="relative w-full max-w-4xl min-h-[450px] border border-light-border dark:border-zinc-700 bg-light-bg dark:bg-black p-8 shadow-sm flex flex-col items-center">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-accent-slate dark:text-zinc-600">FIG 1.1 ORCHESTRATION FLOW</div>
            
            {/* The Hub (Orchestrator) */}
            <div className="relative z-20 mb-10 w-full flex flex-col items-center">
               <div className="relative group">
                  {/* Lines radiating from Orchestrator to Agent Layer */}
                  <div className="absolute left-1/2 top-full w-[1px] h-10 bg-gradient-to-b from-primary/50 to-transparent"></div>
                  
                  <div className="px-8 py-4 border-2 border-primary bg-primary/5 text-primary font-mono text-sm font-bold tracking-widest rounded shadow-[0_0_20px_rgba(74,144,226,0.2)] flex items-center gap-3">
                    <BrainCircuit className="w-5 h-5 animate-pulse" />
                    AI ORCHESTRATOR
                  </div>
               </div>
            </div>

            {/* The Spoke Layer (Agents) */}
            <div className="relative w-full">
               {/* Horizontal Connector Line */}
               <div className="absolute top-0 left-[12%] right-[12%] h-[1px] border-t-2 border-dashed border-light-border dark:border-zinc-700"></div>

               {/* Agents Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                  
                  {/* Spoke 1: Harvester */}
                  <div className="flex flex-col items-center group relative">
                     {/* Vertical Connector */}
                     <div className="absolute -top-8 left-1/2 w-[1px] h-8 border-l border-light-border dark:border-zinc-700"></div>
                     
                     <div className="w-full aspect-[4/3] border border-light-border dark:border-zinc-800 bg-light-elevated dark:bg-zinc-900 p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary hover:-translate-y-1">
                        <Database className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Harvester</span>
                     </div>
                  </div>

                  {/* Spoke 2: Trend */}
                  <div className="flex flex-col items-center group relative">
                     <div className="absolute -top-8 left-1/2 w-[1px] h-8 border-l border-light-border dark:border-zinc-700"></div>
                     <div className="w-full aspect-[4/3] border border-light-border dark:border-zinc-800 bg-light-elevated dark:bg-zinc-900 p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary hover:-translate-y-1">
                        <LineChart className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Trend</span>
                     </div>
                  </div>

                  {/* Spoke 3: MCTS */}
                  <div className="flex flex-col items-center group relative">
                     <div className="absolute -top-8 left-1/2 w-[1px] h-8 border-l border-light-border dark:border-zinc-700"></div>
                     <div className="w-full aspect-[4/3] border border-light-border dark:border-zinc-800 bg-light-elevated dark:bg-zinc-900 p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary hover:-translate-y-1">
                        <Network className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">MCTS</span>
                     </div>
                  </div>

                  {/* Spoke 4: Order Mgr */}
                  <div className="flex flex-col items-center group relative">
                     <div className="absolute -top-8 left-1/2 w-[1px] h-8 border-l border-light-border dark:border-zinc-700"></div>
                     <div className="w-full aspect-[4/3] border border-light-border dark:border-zinc-800 bg-light-elevated dark:bg-zinc-900 p-4 flex flex-col items-center justify-center gap-3 transition-all hover:border-primary hover:-translate-y-1">
                        <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Order Mgr</span>
                     </div>
                  </div>

               </div>
            </div>

            {/* Bottom Legend */}
            <div className="mt-auto pt-10">
               <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-light-border dark:border-zinc-800 bg-light-surface dark:bg-zinc-900/50">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-accent-slate dark:text-zinc-500 uppercase tracking-widest">Secure Execution Environment</span>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-light-bg dark:bg-black py-12 px-6 border-t border-light-border dark:border-zinc-800">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
           <div>
             {/* Footer Logo Animation */}
             <div className="flex items-center gap-2 mb-4 group cursor-pointer">
               <InfinityIcon 
                 size={30} 
                 className="text-primary transition-transform duration-700 ease-in-out group-hover:rotate-180" 
                 strokeWidth={2.5} 
               /> 
               <span className="font-heading font-bold tracking-tight text-slate-900 dark:text-white">AURACHAIN</span>
             </div>
             <p className="text-sm text-accent-slate dark:text-zinc-500 max-w-xs font-sans">
               Open-source multi-agent intelligence platform for the modern enterprise.
             </p>
           </div>
           
           <div className="text-right">
              {/* Smooth Footer Button */}
              <Link 
                to="/app" 
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-mono font-bold tracking-tighter text-slate-900 dark:text-white border border-slate-900 dark:border-zinc-100 rounded-sm transition-all duration-300 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span className="absolute inset-0 w-full h-full bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></span>
                <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-white">
                  ENTER DASHBOARD 
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </Link>
              
              <div className="text-[10px] font-mono text-accent-slate dark:text-zinc-600 mt-2">
                © {new Date().getFullYear()} AURACHAIN // SYSTEM_READY
              </div>
           </div>
        </div>
      </footer>

    </div>
  );
}