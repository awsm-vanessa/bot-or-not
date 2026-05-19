import React, { useState, useRef } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Upload, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Bot,
  Copy,
  MapPin,
  Sparkles,
  Camera,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnalysisResult {
  score: number;
  classification: "REAL" | "SUSPICIOUS" | "BOT";
  reasoning: string;
  markers: string[];
}

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const analyzeProfile = async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze profile.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (classification: string) => {
    switch (classification) {
      case "REAL": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "SUSPICIOUS": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "BOT": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusIcon = (classification: string) => {
    switch (classification) {
      case "REAL": return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case "SUSPICIOUS": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "BOT": return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080809] text-slate-400 font-sans selection:bg-rose-500/30 antialiased overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[60%] h-[40%] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-[10%] w-[50%] h-[50%] bg-rose-600/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6 pb-24">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-white/5 pb-10">
          <div className="flex items-center gap-5 mb-6 md:mb-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
              <div className="relative w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <ShieldAlert className="w-8 h-8 text-rose-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-display font-[900] text-white tracking-tighter uppercase leading-none italic">
                BOT OR NOT<span className="text-rose-600">?</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] font-bold mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Never waste another second on a dating app bot. / v3.2.0
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <button 
              onClick={() => setShowGuide(true)}
              className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center gap-2 group"
            >
              <Info className="w-4 h-4 text-rose-500" />
              How to Use
            </button>
            <div className="h-10 w-px bg-white/5 hidden lg:block" />
            <div className="hidden xl:flex flex-col items-end">
              <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest leading-none">AI Neural Core Status</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-emerald-500" />
                </div>
                <span className="text-[10px] font-bold text-emerald-500">OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Modal */}
        <AnimatePresence>
          {showGuide && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGuide(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#0A0A0B] border border-white/10 rounded-[40px] w-full max-w-2xl p-10 md:p-14 relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] pointer-events-none" />
                  
                  <button 
                    onClick={() => setShowGuide(false)}
                    className="absolute top-8 right-8 p-2 rounded-full bg-white/5 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tight">Deployment Guide</h3>
                      <p className="text-slate-400 font-medium">Follow these steps to neutralize target bot activity.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {[
                        { step: "01", title: "Copy a Humanity Check", body: "Select a curated question from our 'Tactical Intel' playbook and paste it into your dating chat. These are designed to break the logic patterns of scripted AI." },
                        { step: "02", title: "Capture Intelligence", body: "Take clean screenshots of the suspect's profile bio, photos, or their creative responses (or failure to answer) to your humanity check." },
                        { step: "03", title: "Execute Diagnostic", body: "Upload your payload to 'Intelligence Capture' and hit Execute. Our neural core analyzes photo metadata, linguistic entropy, and GAN artifacts." },
                        { step: "04", title: "Neutralize Threat", body: "Review the Risk Index. If the verdict is BOT or SUSPICIOUS, decommissioning the match is advised to protect your time and data." }
                      ].map((s, i) => (
                        <div key={i} className="flex gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-rose-500 font-black shrink-0 shadow-xl">
                            {s.step}
                          </div>
                          <div className="space-y-2 pt-1">
                            <h4 className="text-white font-black uppercase text-sm tracking-widest">{s.title}</h4>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">{s.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowGuide(false)}
                      className="w-full py-5 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.3em] text-xs hover:bg-slate-200 transition-colors shadow-2xl"
                    >
                      Understood / Ready for Ops
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hero CTA / Value Prop */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-white/[0.01] border border-white/5 rounded-[40px] p-10 md:p-14"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/[0.03] to-transparent pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                  Alpha Unit Access
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-[900] text-white tracking-tight leading-[0.95] max-w-2xl">
                  Slay the script. <br />
                  <span className="text-slate-500">Find the signal.</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
                  High-society scammers use AI agents to build rapport. We use superior patterns to dismantle them. Intelligence for the modern dating landscape.
                </p>
                <div className="flex flex-wrap gap-8 pt-6">
                  {[
                    "No Persistent Logs",
                    "Computer Vision Scan",
                    "Linguistic Profiling"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-3xl group hover:border-rose-500/20 transition-all">
                  <div className="text-3xl font-black text-white mb-1 group-hover:text-rose-500 transition-colors tracking-tighter">98.4<span className="text-sm font-bold text-slate-600 ml-1">%</span></div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Scam Logic Detection</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-3xl group hover:border-blue-500/20 transition-all">
                  <div className="text-3xl font-black text-white mb-1 group-hover:text-blue-500 transition-colors tracking-tighter">250K+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Risk Patterns Checked</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Playbook & Analysis Controls */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Step 1: The Playbook */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-sm font-black text-rose-500 shadow-xl">
                    01
                  </div>
                  <h3 className="text-2xl font-display font-[900] text-white tracking-tight uppercase italic">Pattern Interrogation</h3>
                </div>
                <div className="h-px flex-1 bg-white/5 mx-6 hidden sm:block" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    title: "Regional Sync",
                    desc: "Test for localized knowledge gaps.",
                    test: "What's the best local spot for a date in [Your Area]?"
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    title: "Pattern Divergence",
                    desc: "Break their AI-generated rapport script.",
                    test: "If you were a color today, which one would you be?"
                  },
                  {
                    icon: <Camera className="w-5 h-5" />,
                    title: "Physical Evidence",
                    desc: "Force a non-templated response.",
                    test: "Send a quick selfie giving a thumbs up! (Verification)"
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -4 }}
                    className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] group transition-all hover:bg-white/[0.04] flex flex-col"
                  >
                    <div className="text-rose-500 mb-4 bg-rose-500/10 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="text-sm font-black text-white mb-2 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mb-6 leading-relaxed font-medium">{item.desc}</p>
                    <div className="mt-auto relative bg-black/40 p-4 rounded-2xl border border-white/5 overflow-hidden">
                      <p className="text-[10px] text-slate-300 leading-normal italic pr-6 group-hover:text-white transition-colors">"{item.test}"</p>
                      <button 
                        onClick={() => copyToClipboard(item.test)}
                        className="absolute bottom-3 right-3 p-1.5 bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all hover:scale-110"
                        title="Copy Intelligence"
                      >
                        {copiedText === item.test ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Step 2: Upload Evidence */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-sm font-black text-rose-500 shadow-xl">
                    02
                  </div>
                  <h3 className="text-2xl font-display font-[900] text-white tracking-tight uppercase italic">Intelligence Capture</h3>
                </div>
                <div className="h-px flex-1 bg-white/5 mx-6 hidden sm:block" />
              </div>

              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative min-h-[340px] border-2 border-dashed border-white/10 rounded-[40px] bg-white/[0.01] hover:bg-white/[0.03] hover:border-rose-500/40 transition-all cursor-pointer flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="relative w-24 h-24 rounded-3xl bg-black border border-white/10 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <Upload className="w-10 h-10 text-slate-600 group-hover:text-rose-500 transition-colors" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                      <Check className="w-4 h-4 text-black font-black" />
                    </div>
                  </div>
                  <h4 className="text-white font-[900] text-2xl mb-3 tracking-tight">Drop Evidence Files</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                    Upload chat logs, suspicious profile photos, or bio screenshots for deep-layer heuristic scanning.
                  </p>
                  <div className="mt-10 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/50 border border-white/5 text-[10px] font-[800] text-slate-500 tracking-[0.2em]">
                    <Search className="w-3.5 h-3.5 text-rose-500" />
                    AUTO-DIAGNOSTIC ACTIVE
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    multiple 
                    accept="image/*"
                  />
                </div>

                {/* Selected Files Controls */}
                <AnimatePresence>
                  {images.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 backdrop-blur-3xl shadow-2xl"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Evidence Payload</span>
                          <span className="text-lg font-black text-white">{images.length} File{images.length !== 1 ? 's' : ''} Staged</span>
                        </div>
                        <button 
                          onClick={() => setImages([])}
                          className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-[800] hover:bg-rose-500/20 transition-all uppercase tracking-widest"
                        >
                          Purge Session
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mb-10">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                            <img src={img} className="w-full h-full object-cover transition-all group-hover:scale-110" alt="evidence preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => removeImage(idx)}
                                className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        disabled={isAnalyzing}
                        onClick={analyzeProfile}
                        className="group relative w-full h-20 bg-white text-black hover:bg-slate-100 rounded-[24px] font-[900] uppercase tracking-[0.3em] text-sm overflow-hidden transition-all active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]"
                      >
                        <div className="relative z-10 flex items-center justify-center gap-4">
                          {isAnalyzing ? (
                            <>
                              <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                              DECODING PATTERNS
                            </>
                          ) : (
                            <>
                              <Search className="w-5 h-5" />
                              EXECUTE DIAGNOSTIC
                            </>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Results */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="sticky top-6 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-sm font-black text-rose-500 shadow-xl">
                    03
                  </div>
                  <h3 className="text-2xl font-display font-[900] text-white tracking-tight uppercase italic">Verdict Report</h3>
                </div>
              </div>

              <div className="relative bg-white/[0.02] border border-white/5 rounded-[40px] p-10 min-h-[600px] flex flex-col backdrop-blur-3xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
                
                {isAnalyzing && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent absolute animate-scan shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                  </div>
                )}

                {!result && !isAnalyzing && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
                    <div className="relative flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.01]">
                        <Bot className="w-10 h-10 text-slate-800" />
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-[-20px] rounded-full border border-rose-500/20"
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm">System Standby</h4>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-[280px] mx-auto font-medium">
                        Upload evidence payload (Step 02) to initialize high-confidence risk assessment.
                      </p>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
                    <div className="relative">
                      <div className="w-32 h-32 border border-white/5 rounded-full flex items-center justify-center bg-black/50">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-1 border-b-2 border-rose-500/40 rounded-full"
                        />
                        <div className="text-[10px] font-mono font-black text-rose-500 tracking-widest uppercase">
                          SCANNED
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-rose-500 font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Running Neural Pattern Recognition</p>
                      <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
                        <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-full w-1/2 bg-rose-500/40"
                          />
                        </div>
                        <p className="text-slate-600 font-mono text-[8px] uppercase tracking-tighter">Analyzing photo metadata & syntactical variance</p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-rose-600/10 border border-rose-600/30 p-8 rounded-[32px] space-y-6 text-center">
                    <div className="w-16 h-16 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto text-rose-500">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <span className="font-[900] uppercase tracking-[0.4em] text-[10px] text-rose-500">System Interruption</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{error}</p>
                    </div>
                    <button 
                      onClick={() => setError(null)}
                      className="w-full py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                    >
                      Restart Logic Core
                    </button>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {result && (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col h-full"
                    >
                      {/* Classification Badge */}
                      <div className="flex flex-col items-center text-center mb-12">
                        <div className="relative mb-8 group">
                          <div className={`absolute -inset-4 rounded-full blur-2xl opacity-20 ${result.score > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <div className={`relative px-8 py-4 rounded-[20px] border text-sm font-[900] uppercase tracking-[0.3em] flex items-center gap-4 ${getStatusColor(result.classification)} shadow-2xl`}>
                            {getStatusIcon(result.classification)}
                            {result.classification}
                          </div>
                        </div>

                        <div className="relative">
                          <span className="text-8xl font-[900] text-white leading-none tracking-tighter">
                            {result.score}<span className="text-2xl text-slate-700 font-bold ml-1">%</span>
                          </span>
                          <p className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em] mt-6">
                            Verified Risk Index
                          </p>
                        </div>
                      </div>

                      {/* Diagnostic Summary */}
                      <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] mb-10 shadow-inner">
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Final Intelligence Summary
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed font-medium italic">
                          "{result.reasoning}"
                        </p>
                      </div>

                      {/* Detected Markers */}
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                          <ShieldAlert className="w-4 h-4" />
                          Diagnostic Red-Flags
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {result.markers.map((marker, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="px-5 py-4 rounded-2xl bg-white/[0.01] border border-white/5 text-[11px] font-[700] text-slate-300 flex items-center justify-between group hover:border-white/10 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${result.score > 50 ? 'bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.6)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'}`} />
                                {marker}
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-slate-500 transition-colors" />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <button 
                          onClick={() => {
                            setResult(null);
                            setImages([]);
                          }}
                          className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em]"
                        >
                          Decommission Session
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Footer */}
        <footer className="mt-32 pt-20 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-20 opacity-60">
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-white font-display font-black text-sm uppercase tracking-widest italic">
                Ironclad Privacy Protocol
              </h3>
            </div>
            <p className="text-[11px] leading-relaxed font-[500] text-slate-400 max-w-md uppercase tracking-wider">
              SIGNAL operates on a strict ephemeral architecture. We analyze pattern logic, not identity. Your intelligence feed is encrypted end-to-end and purged from the physical buffer the moment your session is decommissioned.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setShowGuide(true)}
                className="text-[10px] font-black text-white hover:text-rose-500 uppercase tracking-[0.3em] transition-all underline underline-offset-8 decoration-white/20 hover:decoration-rose-500/50"
              >
                Mission Brief: How to Use
              </button>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-slate-200 font-black text-[10px] uppercase tracking-[0.3em]">Heuristic Core</h4>
              <ul className="text-[9px] space-y-3 font-mono text-slate-500 font-bold uppercase tracking-widest">
                <li className="flex items-center gap-2 saturate-0 hover:saturate-100 transition-all cursor-default text-rose-500">
                  <div className="w-1 h-1 bg-current rounded-full" /> 
                  GAN ARTIFACTS
                </li>
                <li>Linguistic Entropy</li>
                <li>Exif Sanitization</li>
                <li>Red-Flag Index</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-slate-200 font-black text-[10px] uppercase tracking-[0.3em]">Hardware</h4>
              <ul className="text-[9px] space-y-3 font-mono text-slate-500 font-bold uppercase tracking-widest">
                <li>Gemini Flash Core</li>
                <li className="text-emerald-500 flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" /> 
                  Node: US-WEST
                </li>
                <li>SSLv3 ENCRYPTED</li>
                <li>2.4ms LATENCY</li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
