import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Eye, 
  Watch, 
  Users, 
  FileText, 
  Lock, 
  Activity, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Clock, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  latencyMs: number;
  threatCount: number;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  triggerEmergencyDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  latencyMs,
  threatCount,
  audioEnabled,
  setAudioEnabled,
  triggerEmergencyDemo
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [zuluTime, setZuluTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
      setZuluTime(now.toISOString().slice(11, 19) + 'Z');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'command', label: 'C2 Command Center', icon: Activity, badge: threatCount > 0 ? threatCount : null },
    { id: 'edge-ai', label: 'Edge-AI Vision (YOLOv8)', icon: Eye, badge: '94.6%' },
    { id: 'mesh', label: 'LoRa Mesh Topology', icon: Radio, badge: 'Mesh-9' },
    { id: 'wearable', label: 'Soldier Wearable SOS', icon: Watch },
    { id: 'family-relay', label: 'Zero-Leak Family Relay', icon: Users, badge: 'Air-Gap' },
    { id: 'pitch-specs', label: 'Architecture & iDEX Pitch', icon: FileText },
  ];

  return (
    <header className="border-b border-cyan-900/40 bg-[#070c16]/95 backdrop-blur-md sticky top-0 z-50">
      {/* Top Telemetry Strip */}
      <div className="px-4 py-1.5 border-b border-slate-800/80 bg-black/60 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-cyan-400 font-semibold tracking-wider">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            DEFENCE DEPLOYMENT: NORTHERN SECTOR (LAC / LOC)
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center text-emerald-400">
            <Lock className="w-3 h-3 mr-1" /> AIR-GAP POLICY: ENFORCED (ZERO-LEAK)
          </span>
          <span className="hidden lg:inline-block text-slate-600">|</span>
          <span className="hidden lg:inline-flex items-center text-amber-300">
            <Zap className="w-3 h-3 mr-1" /> MESH LATENCY: {latencyMs}ms (&lt;2.0s TARGET)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{currentTime}</span>
            <span className="text-slate-500">({zuluTime})</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1 hover:text-cyan-400 transition-colors"
            title={audioEnabled ? "Mute tactical sound alerts" : "Enable tactical sound alerts"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          <button
            onClick={triggerEmergencyDemo}
            className="px-2 py-0.5 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 flex items-center font-bold tracking-wider text-[11px] transition-all"
          >
            <ShieldAlert className="w-3 h-3 mr-1 animate-pulse" />
            TEST EMERGENCY SOS
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('command')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-red-600/20 border border-cyan-500/50 flex items-center justify-center relative shadow-lg shadow-cyan-950/40">
            <Radio className="w-5 h-5 text-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-widest text-white uppercase font-mono">
                SENTINEL<span className="text-cyan-400">LINK</span>
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-mono">
                MIL-SPEC C2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight">
              Edge-AI Surveillance • Offline LoRa Mesh • Zero-Leakage Relay
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    typeof item.badge === 'number'
                      ? 'bg-red-500/30 text-red-300 border border-red-500/60'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
