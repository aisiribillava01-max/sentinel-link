import React, { useState, useEffect } from 'react';
import { SoldierBiometrics } from '../types';
import { 
  Watch, 
  Heart, 
  Activity, 
  Compass, 
  ShieldAlert, 
  BatteryCharging, 
  Sun, 
  Radio, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  EyeOff, 
  WifiOff,
  Thermometer,
  Zap
} from 'lucide-react';

interface WearableSOSProps {
  soldier: SoldierBiometrics;
  onTriggerSOS: (sosActive: boolean) => void;
  onSimulateManDown: () => void;
  onToggleStealthMode: () => void;
}

export const WearableSOS: React.FC<WearableSOSProps> = ({
  soldier,
  onTriggerSOS,
  onSimulateManDown,
  onToggleStealthMode
}) => {
  const [ecgLine, setEcgLine] = useState<number[]>([50, 50, 52, 48, 85, 20, 60, 50, 50, 50]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Live pulsating ECG heart rate graph animation
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgLine(prev => {
        const next = [...prev.slice(1)];
        // Create an authentic P-Q-R-S-T wave pulse periodically
        const step = Math.random();
        if (step > 0.75) {
          next.push(85); // R-peak
        } else if (step > 0.6) {
          next.push(20); // S-trough
        } else if (step > 0.45) {
          next.push(60); // T-wave
        } else {
          next.push(50 + (Math.random() * 4 - 2)); // Baseline
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleSosPress = () => {
    onTriggerSOS(!soldier.isSosActive);
  };

  return (
    <div className="space-y-5">
      {/* Module Title Bar */}
      <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40">
            <Watch className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center">
              SOLDIER TACTICAL WEARABLE & BIOMETRIC SOS UNIT
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Garmin/Mil-Spec rugged tactical interface with one-press emergency beacon, fall sensor, and offline LoRa telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-slate-400">ASSIGNED OPERATOR:</span>
          <span className="text-white font-bold bg-black/60 px-2.5 py-1 rounded border border-slate-700">
            {soldier.rank} {soldier.callsign} ({soldier.soldierId})
          </span>
        </div>
      </div>

      {/* Main Wearable Layout: Watch on Left, Biometric Racks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Virtual Tactical Smartwatch (6 cols) */}
        <div className="lg:col-span-6 flex justify-center py-4">
          {/* Rugged Watch Outer Casing */}
          <div className="w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#111622] border-[12px] border-[#1b2230] shadow-[0_0_50px_rgba(0,0,0,0.9)] relative flex items-center justify-center p-3 select-none">
            {/* Tactical Bezel Screws */}
            <div className="absolute top-2 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-0.5 bg-slate-900"></span>
            </div>
            <div className="absolute bottom-2 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-0.5 bg-slate-900"></span>
            </div>
            <div className="absolute left-2 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-0.5 bg-slate-900 rotate-90"></span>
            </div>
            <div className="absolute right-2 w-3 h-3 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-0.5 bg-slate-900 rotate-90"></span>
            </div>

            {/* Bezel Labels */}
            <span className="absolute top-4 text-[9px] font-mono text-slate-400 font-bold tracking-widest">TACTICAL</span>
            <span className="absolute bottom-4 text-[9px] font-mono text-cyan-400 font-bold tracking-widest">SOLAR</span>
            <span className="absolute left-5 text-[8px] font-mono text-slate-400 font-bold -rotate-90">LIGHT</span>
            <span className="absolute right-5 text-[8px] font-mono text-slate-400 font-bold rotate-90">GPS</span>

            {/* Inner Solar Photovoltaic Rim */}
            <div className="w-full h-full rounded-full border-2 border-amber-900/30 p-4 flex items-center justify-center bg-black/90 relative overflow-hidden">
              
              {/* Screen Display (Monochrome OLED / Red NVG depending on Stealth) */}
              <div className={`w-full h-full rounded-full p-4 flex flex-col items-center justify-between font-mono transition-colors duration-500 ${
                soldier.isSosActive 
                  ? 'bg-red-950/60 text-red-400 animate-pulse' 
                  : soldier.stealthMode 
                  ? 'bg-[#180000] text-red-500' 
                  : 'bg-[#09110d] text-emerald-400'
              }`}>
                {/* Watch Top Header: Solar & Battery */}
                <div className="w-full flex items-center justify-between text-[10px] pt-2 px-6">
                  <div className="flex items-center space-x-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>99d+</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className={`w-3 h-3 ${soldier.isSosActive ? 'animate-ping' : ''}`} />
                    <span className="font-bold">{soldier.heartRate}</span>
                  </div>
                  <div className="text-[9px] font-bold">SAT 22</div>
                </div>

                {/* Big Digital Clock Display */}
                <div className="text-center my-auto">
                  {soldier.isSosActive ? (
                    <div className="text-center">
                      <div className="text-3xl font-black text-red-500 tracking-wider font-mono animate-bounce">
                        ! SOS !
                      </div>
                      <div className="text-[10px] text-white font-bold bg-red-600 px-2 py-0.5 rounded mt-1">
                        BROADCASTING MESH
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl sm:text-4xl font-black tracking-widest font-mono">
                        15:42<span className="text-xs">38</span>
                      </div>
                      <div className="text-[10px] tracking-wide opacity-80">
                        ZULU 1012 • 4,310m MSL
                      </div>
                    </div>
                  )}

                  {/* Real-time ECG wave visual */}
                  <div className="flex items-center justify-center space-x-1 h-6 mt-1">
                    {ecgLine.map((val, idx) => (
                      <span
                        key={idx}
                        className="w-1 rounded-sm bg-current transition-all"
                        style={{ height: `${(val / 100) * 20}px` }}
                      ></span>
                    ))}
                  </div>
                </div>

                {/* Watch Bottom Bar: MGRS & Compass */}
                <div className="w-full flex items-center justify-between text-[9px] pb-2 px-6 border-t border-current/20 pt-1 opacity-90">
                  <span>MGRS: 45R XA</span>
                  <span>SpO2: {soldier.spO2}%</span>
                  <span>{soldier.stealthMode ? 'STLTH' : 'LORA: OK'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Biometric Status & Interactive Trigger Rack (6 cols) */}
        <div className="lg:col-span-6 space-y-4 font-mono text-xs">
          {/* Big Red SOS Emergency Trigger Button */}
          <div className="bg-[#080d17] border-2 border-red-900/60 rounded-xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white tracking-wider">
                  ONE-PRESS TACTICAL SOS TRIGGER
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                soldier.isSosActive 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {soldier.isSosActive ? 'EMERGENCY ACTIVE' : 'STANDBY READY'}
              </span>
            </div>

            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Instantly packages soldier vitals, fall sensor status, barometric elevation, and encrypted MGRS coordinates into high-priority LoRa mesh packets routed with &lt;2s latency to Forward Command.
            </p>

            <button
              onClick={handleSosPress}
              className={`w-full py-4 rounded-xl font-bold font-mono text-sm tracking-wider flex items-center justify-center space-x-3 transition-all shadow-xl ${
                soldier.isSosActive
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/80 animate-pulse'
                  : 'bg-gradient-to-r from-red-700 via-red-600 to-red-800 hover:from-red-600 hover:to-red-700 text-white shadow-red-950/50 hover:shadow-red-900/80'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-white" />
              <span>{soldier.isSosActive ? 'CANCEL ACTIVE SOS BROADCAST' : 'PRESS TO BROADCAST CASUALTY SOS'}</span>
            </button>
          </div>

          {/* Biometrics Matrix */}
          <div className="bg-[#080d17] border border-slate-800/80 rounded-xl p-4 shadow-xl">
            <h3 className="font-bold text-white mb-3 flex items-center text-xs">
              <Activity className="w-4 h-4 mr-2 text-cyan-400" />
              LIVE SOLDIER BIOMETRICS (MAX30102 TELEMETRY)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#060a12] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center">
                  <Heart className="w-3 h-3 text-red-400 mr-1" /> HEART RATE
                </div>
                <div className="text-xl font-bold text-white mt-1">
                  {soldier.heartRate} <span className="text-[10px] text-slate-400 font-normal">BPM</span>
                </div>
              </div>

              <div className="bg-[#060a12] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center">
                  <Activity className="w-3 h-3 text-blue-400 mr-1" /> BLOOD SpO2
                </div>
                <div className="text-xl font-bold text-white mt-1">
                  {soldier.spO2} <span className="text-[10px] text-slate-400 font-normal">%</span>
                </div>
              </div>

              <div className="bg-[#060a12] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center">
                  <Thermometer className="w-3 h-3 text-amber-400 mr-1" /> CORE TEMP
                </div>
                <div className="text-xl font-bold text-white mt-1">
                  {soldier.coreTemp} <span className="text-[10px] text-slate-400 font-normal">°C</span>
                </div>
              </div>

              <div className="bg-[#060a12] p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center">
                  <Compass className="w-3 h-3 text-cyan-400 mr-1" /> ELEVATION
                </div>
                <div className="text-xl font-bold text-white mt-1">
                  {soldier.altitude} <span className="text-[10px] text-slate-400 font-normal">m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Special Modes: Man-Down & Stealth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSimulateManDown}
              className="p-3 rounded-xl bg-[#080d17] hover:bg-slate-800 border border-slate-800 text-left transition-all"
            >
              <div className="flex items-center space-x-2 text-amber-400 font-bold mb-1">
                <Activity className="w-4 h-4" />
                <span>Simulate Man-Down</span>
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Simulates 3-axis accelerometer impact followed by 20s immobility trigger.
              </div>
            </button>

            <button
              onClick={onToggleStealthMode}
              className={`p-3 rounded-xl border text-left transition-all ${
                soldier.stealthMode 
                  ? 'bg-red-950/40 border-red-600 text-red-300' 
                  : 'bg-[#080d17] hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold mb-1 text-cyan-400">
                <EyeOff className="w-4 h-4" />
                <span>Stealth / Blackout</span>
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {soldier.stealthMode ? 'ACTIVE: RF silence & red NVG screen.' : 'Disables RF beacons & enables NVG display.'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
