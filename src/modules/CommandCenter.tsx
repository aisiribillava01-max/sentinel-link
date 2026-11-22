import React from 'react';
import { 
  ThreatAlert, 
  MeshNode, 
  SoldierBiometrics, 
  SystemMetrics 
} from '../types';
import { TacticalRadar } from '../components/TacticalRadar';
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  Zap, 
  CheckCircle2, 
  AlertOctagon, 
  Wifi, 
  Cpu, 
  Clock, 
  ArrowUpRight, 
  Sliders, 
  Battery, 
  Heart, 
  Mountain, 
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface CommandCenterProps {
  metrics: SystemMetrics;
  nodes: MeshNode[];
  threats: ThreatAlert[];
  soldier: SoldierBiometrics;
  selectedNode: MeshNode | null;
  setSelectedNode: (node: MeshNode | null) => void;
  onOpenThreatModal: (threat: ThreatAlert) => void;
  onSimulateThreat: (scenario: 'incursion' | 'wildlife' | 'soldier_sos' | 'jamming') => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  metrics,
  nodes,
  threats,
  soldier,
  selectedNode,
  setSelectedNode,
  onOpenThreatModal,
  onSimulateThreat
}) => {
  return (
    <div className="space-y-5">
      {/* Top Tactical KPI Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Metric 1: Alert Latency */}
        <div className="bg-[#090f1a] border border-cyan-900/60 p-3.5 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>ALERT LATENCY</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-cyan-400 font-mono">{(metrics.alertLatencyMs / 1000).toFixed(2)}</span>
            <span className="text-xs font-mono text-cyan-300">s</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3 h-3 mr-1" /> &lt;2.0s TARGET MET
          </div>
        </div>

        {/* Metric 2: Threat Precision */}
        <div className="bg-[#090f1a] border border-emerald-900/60 p-3.5 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>THREAT PRECISION</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">{metrics.threatPrecisionPct}%</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3 h-3 mr-1" /> &gt;92% BENCHMARK
          </div>
        </div>

        {/* Metric 3: Active Mesh Nodes */}
        <div className="bg-[#090f1a] border border-blue-900/60 p-3.5 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>TACTICAL MESH</span>
            <Radio className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-white font-mono">
              {nodes.filter(n => n.status === 'ONLINE').length}/{nodes.length}
            </span>
            <span className="text-xs text-blue-400 font-mono">NODES</span>
          </div>
          <div className="mt-1 text-[10px] text-blue-300 font-mono">
            865-867 MHz ISM BAND
          </div>
        </div>

        {/* Metric 4: False Alarm Suppression */}
        <div className="bg-[#090f1a] border border-amber-900/60 p-3.5 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>WILDLIFE FILTER</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-amber-400 font-mono">{metrics.falseAlarmSuppressionPct}%</span>
          </div>
          <div className="mt-1 text-[10px] text-amber-300 font-mono">
            FAUNA AUTO-SUPPRESSED
          </div>
        </div>

        {/* Metric 5: Air-Gap Cryptography */}
        <div className="bg-[#090f1a] border border-cyan-900/60 p-3.5 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>DATA ISOLATION</span>
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold text-white font-mono">100%</span>
            <span className="text-xs text-cyan-400 font-mono">AIR-GAP</span>
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 font-mono">
            0% LOCATION LEAK
          </div>
        </div>

        {/* Metric 6: Packet Delivery Rate */}
        <div className="bg-[#090f1a] border border-slate-800 p-3.5 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>PACKET TRANSIT</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">{metrics.packetsDeliveredPct}%</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400 font-mono">
            MULTI-HOP DYNAMIC
          </div>
        </div>
      </div>

      {/* Main Command Center Grid: Radar on Left, Alerts & Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Radar (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#080d17] border border-slate-800/80 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <h3 className="text-sm font-bold font-mono tracking-wider text-white">
                  TACTICAL SURVEILLANCE RADAR & MESH TOPOLOGY
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">
                NORTHERN COMMAND • CHUMBI SECTOR
              </span>
            </div>

            <TacticalRadar
              nodes={nodes}
              threats={threats}
              selectedNodeId={selectedNode ? selectedNode.id : null}
              onSelectNode={(node) => setSelectedNode(node)}
              height={380}
            />

            {/* Tactical Scenario Quick Injections */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span>SIMULATE TACTICAL FIELD SCENARIOS (FOR DEMO & EVALUATION):</span>
                <span className="text-[10px] text-cyan-400">INSTANT INJECTION</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => onSimulateThreat('incursion')}
                  className="px-2.5 py-2 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-xs font-mono font-medium flex items-center justify-center space-x-1.5 transition-all"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Hostile Breach</span>
                </button>

                <button
                  onClick={() => onSimulateThreat('wildlife')}
                  className="px-2.5 py-2 rounded bg-amber-950/50 hover:bg-amber-900/50 border border-amber-700/60 text-amber-300 text-xs font-mono font-medium flex items-center justify-center space-x-1.5 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Wildlife Filter</span>
                </button>

                <button
                  onClick={() => onSimulateThreat('soldier_sos')}
                  className="px-2.5 py-2 rounded bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/60 text-purple-300 text-xs font-mono font-medium flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>Soldier SOS</span>
                </button>

                <button
                  onClick={() => onSimulateThreat('jamming')}
                  className="px-2.5 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs font-mono font-medium flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>EW Jam Node</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Incursions & Selected Node Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Threat Incursion Queue */}
          <div className="bg-[#080d17] border border-slate-800/80 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold font-mono tracking-wider text-white">
                  INCIDENT & THREAT LOGS
                </h3>
              </div>
              <span className="text-[11px] font-mono text-red-400 bg-red-950/70 border border-red-800/60 px-2 py-0.5 rounded font-bold">
                {threats.filter(t => t.status === 'ACTIVE_INVESTIGATION').length} PENDING REVIEW
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {threats.map((threat) => {
                const isActive = threat.status === 'ACTIVE_INVESTIGATION';
                return (
                  <div
                    key={threat.id}
                    onClick={() => onOpenThreatModal(threat)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-red-950/30 border-red-600/70 hover:bg-red-950/50 hover:border-red-500'
                        : threat.status === 'DISMISSED_WILDLIFE'
                        ? 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100'
                        : 'bg-emerald-950/20 border-emerald-800/60 hover:bg-emerald-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
                        <span className="text-xs font-mono font-bold text-white">{threat.id}</span>
                        <span className="text-[10px] font-mono text-slate-400">({threat.timestamp})</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isActive 
                          ? 'bg-red-900/80 text-red-200 border border-red-700' 
                          : threat.status === 'DISMISSED_WILDLIFE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {threat.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-mono mb-2 line-clamp-1">
                      {threat.details}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/60 pt-1.5">
                      <span className="text-cyan-400">Grid: {threat.coordinates.mgrs}</span>
                      <span className="text-emerald-400">Conf: {(threat.confidence * 100).toFixed(0)}%</span>
                      <span className="text-slate-400 flex items-center">
                        Review <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Telemetry Inspector */}
          <div className="bg-[#080d17] border border-slate-800/80 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono tracking-wider text-white">
                  NODE TELEMETRY INSPECTOR
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedNode ? selectedNode.callsign : 'CLICK A RADAR NODE'}
              </span>
            </div>

            {selectedNode ? (
              <div className="bg-[#060a12] p-3.5 rounded-lg border border-cyan-900/40 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <div className="text-cyan-400 font-bold">{selectedNode.callsign}</div>
                    <div className="text-[10px] text-slate-400">{selectedNode.id} • {selectedNode.type}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedNode.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery:</span>
                    <span className="text-white font-bold">{selectedNode.battery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Elevation:</span>
                    <span className="text-cyan-300">{selectedNode.elevation} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signal RSSI:</span>
                    <span className="text-amber-300">{selectedNode.rssi} dBm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RF SNR:</span>
                    <span className="text-emerald-400">+{selectedNode.snr} dB</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 text-[10px]">
                  <span className="text-slate-400">AES-256 Fingerprint: </span>
                  <span className="text-cyan-300">{selectedNode.aesKeyFingerprint}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Firmware: {selectedNode.firmwareVersion}</span>
                  <span>Last Handshake: {selectedNode.lastPing}</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#060a12] p-6 rounded-lg border border-slate-800/80 text-center text-xs font-mono text-slate-400">
                <Radio className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
                Select any base station, repeater mast, or patrol unit on the radar to inspect RF packet telemetry.
              </div>
            )}

            {/* Quick Soldier Wearable Glance */}
            <div className="mt-3 p-3 rounded-lg bg-[#060a12] border border-emerald-950 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <Heart className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white">{soldier.callsign} ({soldier.rank})</div>
                  <div className="text-[10px] font-mono text-slate-400">HR: {soldier.heartRate} BPM • SpO2: {soldier.spO2}% • {soldier.altitude}m</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                VITALS NORMAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
