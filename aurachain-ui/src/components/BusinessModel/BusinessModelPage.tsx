// aurachain-ui/src/components/BusinessModel/BusinessModelPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  InfinityIcon, 
  Factory, 
  BrainCircuit, 
  TrendingUp, 
  Truck, 
  ShieldCheck,
  RotateCw,
  FlaskConical
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import ThemeToggle from '../Shared/ThemeToggle';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from '@studio-freight/lenis';

// Utility for cleaner class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BusinessModelPage() {
  const { isDarkMode } = useUIStore();
  // CHANGED: Default state set to 'monthly' instead of 'yearly'
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Handle Theme Class on Root
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  // Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(2, -10 * t),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });

    let frameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
}, []);


  // --- DATA ---
  const SAAS_TIERS = [
    {
      name: "STARTER",
      price: { monthly: "₹599/mo", yearly: "₹5,988/yr" }, 
      desc: "Micro enterprises (80% of market).",
      features: ["8 AI Agents", "20K Row Limit", "Basic Forecasting"],
      highlight: false
    },
    {
      name: "PROFESSIONAL",
      price: { monthly: "₹2,499/mo", yearly: "₹23,988/yr" },
      desc: "Small businesses scaling up.",
      features: ["Unlimited Data", "Priority Support", "MCTS Optimization"],
      highlight: true // This triggers the primary border
    },
    {
      name: "ENTERPRISE",
      price: { monthly: "Custom", yearly: "Custom" },
      desc: "Large MSMEs & Corporations.",
      features: ["Dedicated Infra", "White-labeling", "API Access"],
      highlight: false
    }
  ];

  return (
    <div className="bg-light-bg dark:bg-black min-h-screen text-slate-900 dark:text-zinc-100 font-sans selection:bg-primary selection:text-white transition-colors duration-500">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.15]" 
        style={{ 
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* --- HEADER --- */}
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
            <Link to="/app" className="px-5 py-2 bg-primary text-white text-xs font-bold font-mono uppercase tracking-wider hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20">
              Console
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-accent-slate dark:text-zinc-500 mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK_TO_BASE
        </Link>

        {/* --- HERO TITLE --- */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 border border-primary/30 bg-primary/5 text-primary text-[10px] font-mono font-bold tracking-widest uppercase rounded-full">
            The Three-Engine Strategy
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-bold mb-6 tracking-tight">
            Software <span className="text-slate-300 dark:text-zinc-700">×</span> Supply <span className="text-slate-300 dark:text-zinc-700">×</span> Research
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            We are not just building a SaaS. We are building an integrated ecosystem where 
            <span className="text-primary font-bold"> Intelligence</span> powers 
            <span className="text-primary font-bold"> Commerce</span>, and profits fund 
            <span className="text-primary font-bold"> Innovation</span>.
          </p>
        </div>

        {/* --- ENGINE 1: SAAS --- */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-8 border-b border-light-border dark:border-zinc-800 pb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-primary">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading">Engine 1: The Intelligence Layer</h2>
              <p className="text-sm font-mono text-slate-500 dark:text-zinc-500">REVENUE STREAM: AI-NATIVE SAAS</p>
            </div>
          </div>

          {/* --- FIXED PRICING TOGGLE --- */}
          <div className="flex justify-center mb-10">
            <div className="relative flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 w-[280px]">
              
              {/* The Sliding Background Pill */}
              <div 
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-out",
                  billingCycle === 'monthly' ? "translate-x-0" : "translate-x-[100%] ml-[2px]"
                )}
              />

              {/* Monthly Button */}
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  "relative z-10 w-1/2 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-colors duration-300 text-center",
                  billingCycle === 'monthly' ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-500"
                )}
              >
                Monthly
              </button>

              {/* Yearly Button */}
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={cn(
                  "relative z-10 w-1/2 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2",
                  billingCycle === 'yearly' ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-500"
                )}
              >
                Yearly
                <span className="text-[9px] bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-800">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* --- PRICING CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAAS_TIERS.map((tier, i) => (
              <div key={i} className={cn(
                "relative p-8 border flex flex-col transition-all duration-300 rounded-xl",
                // Base styles (Light & Dark)
                "bg-white dark:bg-zinc-900",
                // Highlight Logic (Professional Tier)
                tier.highlight 
                  ? "border-primary shadow-[0_0_30px_-10px_rgba(74,144,226,0.2)] bg-primary/5 dark:bg-zinc-900" // Removed dark:bg-primary/5 to fix text interference
                  : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
              )}>
                {tier.highlight && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 font-mono rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={cn(
                    "text-xs font-mono font-bold mb-2 uppercase tracking-wider",
                    tier.highlight ? "text-primary" : "text-slate-500 dark:text-zinc-500"
                  )}>
                    {tier.name}
                  </h3>
                  <div className="text-3xl font-bold mb-2 font-heading transition-all duration-300 text-slate-900 dark:text-white">
                    {/* Dynamic Price Display */}
                    {billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{tier.desc}</p>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={cn(
                        "w-4 h-4 shrink-0",
                        tier.highlight ? "text-primary" : "text-slate-400 dark:text-zinc-600"
                      )} />
                      <span className="text-slate-700 dark:text-zinc-300">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-zinc-500">GROSS MARGIN</span>
                    <span className="text-green-600 dark:text-green-500 font-bold">76%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- ENGINE 2: SUPPLY CHAIN --- */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-10 border-b border-light-border dark:border-zinc-800 pb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading">Engine 2: The Supply Layer</h2>
              <p className="text-sm font-mono text-slate-500 dark:text-zinc-500">REVENUE STREAM: B2B RAW MATERIAL COMMERCE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Strategy Card */}
            <div className="p-8 border border-light-border dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl">
              <h3 className="text-xl font-bold mb-4">The "Zepto for Manufacturing" Strategy</h3>
              <p className="text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Using data from our SaaS users, we build demand heatmaps to deploy micro-warehouses (Dark Stores) in industrial clusters. 
                We offer <strong>4-hour delivery</strong> for critical raw materials.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 border border-light-border dark:border-zinc-800 rounded-lg">
                  <span className="text-sm font-mono text-slate-500">TARGET MARKET</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-200">Micro & Small MSMEs</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 border border-light-border dark:border-zinc-800 rounded-lg">
                  <span className="text-sm font-mono text-slate-500">DELIVERY SPEED</span>
                  <span className="font-bold text-primary">4 Hours (vs 3-7 Days)</span>
                </div>
              </div>
            </div>

            {/* Economics Comparison */}
            <div className="p-8 border border-primary/20 bg-primary/5 dark:bg-primary/5 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <TrendingUp size={120} />
              </div>
              <h3 className="text-xl font-bold mb-6 text-primary">Unit Economics Reality</h3>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 mb-1">TYPICAL QUICK COMMERCE</div>
                  <div className="text-2xl font-bold text-slate-400">₹500</div>
                  <div className="text-xs text-slate-500 mt-1">Avg Order Value</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-primary mb-1">AURACHAIN B2B</div>
                  <div className="text-4xl font-bold text-primary">₹28,500</div>
                  <div className="text-xs text-primary/80 mt-1">Avg Order Value (57x)</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/20 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1">GROSS MARGIN</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-zinc-200">15%</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1">PROFIT/ORDER</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-500">₹4,275</div>
                </div>
              </div>
            </div>
          </div>

          {/* The Chunk Premium Logic */}
          <div className="p-8 border border-light-border dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 rounded-xl">
            <h3 className="font-mono text-xs font-bold text-amber-600 dark:text-amber-500 mb-6 uppercase tracking-widest">Why 15% Margins? The "Chunk Buying" Premium</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <strong className="block mb-2 text-lg text-slate-900 dark:text-zinc-100">1. Small Batch Access</strong>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">Distributors sell 500kg minimum. We sell 10kg. Micro MSMEs pay a <strong>20% premium</strong> willingly to avoid locking capital in bulk stock.</p>
              </div>
              <div>
                <strong className="block mb-2 text-lg text-slate-900 dark:text-zinc-100">2. Zero Downtime</strong>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">When a machine stops for lack of wire, an MSME loses ₹50k/day. Paying ₹600 extra for 4-hour delivery is an ROI of <strong>332x</strong>.</p>
              </div>
              <div>
                <strong className="block mb-2 text-lg text-slate-900 dark:text-zinc-100">3. JIT Inventory</strong>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">No warehouse space needed. MSMEs order weekly. We replace their storage costs with our service premium.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- ENGINE 3: RESEARCH --- */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-10 border-b border-light-border dark:border-zinc-800 pb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading">Engine 3: The Innovation Layer</h2>
              <p className="text-sm font-mono text-slate-500 dark:text-zinc-500">REVENUE STREAM: IP & LICENSING</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Reinvesting for Dominance</h3>
              <p className="text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Supply chain profits are reinvested into India's leading AI Supply Chain Research Lab. 
                We solve hard problems like multi-echelon optimization and federated learning.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-slate-700 dark:text-zinc-300"><strong>IP Moat:</strong> Patents protect our prediction models.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Factory className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-slate-700 dark:text-zinc-300"><strong>Enterprise Licensing:</strong> Selling "AURA Forecast API" to Fortune 500s.</span>
                </li>
              </ul>
            </div>
            <div className="p-6 border border-purple-500/20 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-mono text-purple-600 dark:text-purple-400">PROJECTED IP VALUATION (YR 5)</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹3,000 Cr</span>
              </div>
              <div className="w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-purple-600 dark:bg-purple-400 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* --- THE FLYWHEEL --- */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">The Integrated Flywheel</h2>
            <p className="text-slate-600 dark:text-zinc-400">How the three engines accelerate each other.</p>
          </div>

          <div className="max-w-4xl mx-auto border border-light-border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 rounded-2xl relative">
            {/* Center Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-primary/10 rounded-full">
              <RotateCw className="w-10 h-10 text-primary animate-spin-slow" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="text-center md:text-right space-y-2">
                <h4 className="font-bold text-primary">1. SaaS Acquisition</h4>
                <p className="text-xs text-slate-500">Users join for AI tools. Creates Data.</p>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h4 className="font-bold text-amber-500">2. Demand Signal</h4>
                <p className="text-xs text-slate-500">Order Manager reveals *what* to stock.</p>
              </div>
              <div className="text-center md:text-right space-y-2">
                <h4 className="font-bold text-purple-500">4. Innovation</h4>
                <p className="text-xs text-slate-500">Profits fund better AI models.</p>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h4 className="font-bold text-green-500">3. Supply Profit</h4>
                <p className="text-xs text-slate-500">Dark stores capture 15% margin.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINANCIALS --- */}
        <section>
          <div className="flex items-center gap-4 mb-10 border-b border-light-border dark:border-zinc-800 pb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading">5-Year Vision</h2>
              <p className="text-sm font-mono text-slate-500 dark:text-zinc-500">REVISED PROJECTIONS (15% MARGIN)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-light-border dark:border-zinc-800">
                  <th className="py-4 font-mono text-xs text-slate-500 pl-4">METRIC</th>
                  <th className="py-4 font-mono text-xs text-slate-500">YEAR 1</th>
                  <th className="py-4 font-mono text-xs text-slate-500">YEAR 3</th>
                  <th className="py-4 font-mono text-xs text-primary font-bold pr-4">YEAR 5 (TARGET)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                <tr className="border-b border-light-border dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 font-bold pl-4">SaaS Revenue</td>
                  <td className="py-4">₹12 Cr</td>
                  <td className="py-4">₹120 Cr</td>
                  <td className="py-4 text-primary pr-4">₹600 Cr</td>
                </tr>
                <tr className="border-b border-light-border dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 font-bold pl-4">Supply Revenue</td>
                  <td className="py-4 text-slate-400">--</td>
                  <td className="py-4">₹3,520 Cr</td>
                  <td className="py-4 text-primary pr-4">₹14,080 Cr</td>
                </tr>
                <tr className="border-b border-light-border dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 font-bold pl-4">Total EBITDA</td>
                  <td className="py-4 text-red-400">-₹8 Cr</td>
                  <td className="py-4 text-green-600 dark:text-green-500">₹420 Cr</td>
                  <td className="py-4 text-green-600 dark:text-green-500 pr-4">₹2,380 Cr</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 p-8 bg-zinc-900 text-white rounded-xl text-center shadow-2xl">
            <h3 className="text-sm font-mono text-zinc-400 mb-2">CONSERVATIVE VALUATION (YEAR 5)</h3>
            <div className="text-5xl md:text-7xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              ₹30,000 Crore
            </div>
            <p className="text-zinc-500 max-w-lg mx-auto text-sm">
              Based on a blended multiple of SaaS (10x), Quick Commerce (1.5x), and Research IP (15x).
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}