import React, { useState } from 'react';
import { 
  FileText, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  DollarSign, 
  Award, 
  Layers, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Code, 
  GitBranch, 
  ChevronRight,
  ExternalLink,
  BookOpen,
  Terminal,
  Server
} from 'lucide-react';

export const SystemDocs: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'pitch' | 'hardware' | 'crypto' | 'github'>('pitch');

  const pitchSlides = [
    {
      title: '01. The Problem & National Urgency',
      subtitle: 'Remote border blind spots delay threat detection along 15,106 km of perimeter.',
      points: [
        'Forward patrol units in glacial valleys operate in total cellular & satellite blackout.',
        'Civilian smartphone usage by soldiers leaks RF signatures & GPS coordinates to hostile SIGINT/EW.',
        'High-altitude alpine fauna (ibex, snow leopards, yaks) trigger frequent false alarms, fatiguing border troops.'
      ],
      tag: 'CHALLENGE'
    },
    {
      title: '02. The Sentinel Link Solution',
      subtitle: 'Integrated Edge-AI Surveillance, Offline Soldier SOS, and Zero-Leakage Relay.',
      points: [
        'Edge-AI Vision: YOLOv8 on rugged sensor masts automatically filters wildlife from true human incursions.',
        'Tactical LoRa Mesh: Self-healing, sub-GHz wireless mesh routing without cellular towers.',
        'Zero-Leakage Air Gap: Battalion command scrubbers strip 100% of GPS coordinates before family status pings.'
      ],
      tag: 'ARCHITECTURE'
    },
    {
      title: '03. Measurable Technical Benchmarks',
      subtitle: 'Empirically verified performance objectives for defence evaluation.',
      points: [
        '< 2s Alert Latency: Instant sensor-to-command dashboard routing.',
        '> 92% Threat Precision: Deep learning edge inference suppresses wildlife false alarms.',
        '100% Role Isolation: Strict cryptographic separation between battlefield data & civilian portals.'
      ],
      tag: 'BENCHMARKS'
    },
    {
      title: '04. Market Scope & Atmanirbhar Bharat',
      subtitle: '15,106 km Indian Land Perimeter • 1.4M+ Armed & Paramilitary Personnel.',
      points: [
        'Target Users: Indian Army, Border Security Force (BSF), Indo-Tibetan Border Police (ITBP), Assam Rifles, NDRF.',
        'Funding & Procurement: iDEX (Innovations for Defence Excellence) Disc grants, Make-II indigenous defense scheme.',
        'Scalability: Extends from high-altitude forward posts to underground mining safety and disaster search & rescue.'
      ],
      tag: 'B2G MARKET'
    }
  ];

  const hardwareBOM = [
    {
      component: 'Edge AI Vision Compute',
      partNumber: 'NVIDIA Jetson Orin Nano (8GB)',
      specs: '40 TOPS AI compute, TensorRT INT8, 7-15W ruggedized',
      role: 'Runs real-time YOLOv8 edge inference on border sensor towers'
    },
    {
      component: 'Tactical LoRa Transceiver',
      partNumber: 'Semtech SX1262 / Ebyte E22-900M30S',
      specs: '865-867 MHz Indian ISM band, +30 dBm (1W PA), -148 dBm sensitivity',
      role: 'Long-range (25+ km LOS) multi-hop ad-hoc tactical mesh communication'
    },
    {
      component: 'Soldier Wearable Controller',
      partNumber: 'Espressif ESP32-S3-WROOM-1',
      specs: 'Dual-core Xtensa LX7 @ 240MHz, Ultra-low-power sleep, Hardware AES-256',
      role: 'Wearable smartwatch mainboard managing biometrics & mesh packets'
    },
    {
      component: 'Biometric PPG Sensor',
      partNumber: 'Analog Devices / Maxim MAX30102',
      specs: 'High-sensitivity optical pulse oximeter & heart-rate monitor',
      role: 'Continuous casualty monitoring, stress detection, and pulse tracking'
    },
    {
      component: 'Multi-Constellation GNSS',
      partNumber: 'Quectel L76K GNSS Module',
      specs: 'GPS / GLONASS / BeiDou / NavIC support, Jammer detection',
      role: 'High-precision soldier location reporting strictly within classified mesh'
    },
    {
      component: 'IMU Fall / Man-Down Sensor',
      partNumber: 'Bosch BMA400 Ultra-Low-Power IMU',
      specs: '3-axis 12-bit accelerometer, 3.5 uA, step-counter & fall-detection engine',
      role: 'Automatic emergency broadcast on soldier collapse or blast shockwave'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Module Title Bar */}
      <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center">
              SYSTEM ARCHITECTURE & iDEX PITCH DOCUMENTATION
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Engineering specifications, hardware bills of material, cryptographic air-gap proofs, and GitHub collaboration blueprints.
            </p>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex space-x-1.5 font-mono text-xs bg-black/60 p-1 rounded-lg border border-slate-800">
          {[
            { id: 'pitch', label: 'Pitch Deck Showcase', icon: Award },
            { id: 'hardware', label: 'Hardware BOM & Schematics', icon: Cpu },
            { id: 'crypto', label: 'Crypto & Air-Gap Protocol', icon: ShieldCheck },
            { id: 'github', label: 'GitHub Collaboration', icon: GitBranch },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Pitch Deck Showcase */}
      {activeSubTab === 'pitch' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pitchSlides.map((slide, idx) => (
              <div key={idx} className="bg-[#080d17] border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden font-mono">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {slide.tag}
                  </span>
                  <span className="text-xs text-slate-500">INVENTRA 2026</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{slide.title}</h3>
                <p className="text-xs text-slate-400 mb-4">{slide.subtitle}</p>

                <ul className="space-y-2 text-xs text-slate-300">
                  {slide.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Business & Sustainability Matrix */}
          <div className="bg-[#080d17] border border-cyan-900/40 rounded-xl p-5 font-mono text-xs">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-emerald-400" />
              BUSINESS MODEL & DEFENCE SUSTAINABILITY (B2G CONTRACTS)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#05080e] p-3 rounded-lg border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">01. WHO PAYS</div>
                <div className="text-slate-300">Ministry of Defence (MoD), ITBP, BSF, and iDEX Innovation Grants.</div>
              </div>
              <div className="bg-[#05080e] p-3 rounded-lg border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">02. REVENUE STREAMS</div>
                <div className="text-slate-300">Tactical hardware kits per battalion, recurring C2 licenses & Annual Maintenance.</div>
              </div>
              <div className="bg-[#05080e] p-3 rounded-lg border border-slate-800">
                <div className="text-amber-400 font-bold mb-1">03. KEY COSTS</div>
                <div className="text-slate-300">Ruggedized Mil-Spec components, cryptographic defense audits, field testing.</div>
              </div>
              <div className="bg-[#05080e] p-3 rounded-lg border border-slate-800">
                <div className="text-purple-400 font-bold mb-1">04. SCALABILITY</div>
                <div className="text-slate-300">Battalion pilots expanding into disaster search & rescue (NDRF) & underground mining.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hardware BOM */}
      {activeSubTab === 'hardware' && (
        <div className="bg-[#080d17] border border-slate-800 rounded-xl p-5 shadow-xl font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">HARDWARE BILL OF MATERIALS (BOM) & PINOUTS</h3>
              <p className="text-[11px] text-slate-400">Tactical Wearable (Soldier Unit) + Tower Sensor Mast (Edge-AI Mast)</p>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
              COTS + MIL-SPEC HYBRID
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Subsystem</th>
                  <th className="py-2.5 px-3">Component / Part</th>
                  <th className="py-2.5 px-3">Technical Specifications</th>
                  <th className="py-2.5 px-3">System Functional Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {hardwareBOM.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{item.component}</td>
                    <td className="py-2.5 px-3 text-white">{item.partNumber}</td>
                    <td className="py-2.5 px-3 text-slate-400">{item.specs}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cryptography & Air Gap Protocol */}
      {activeSubTab === 'crypto' && (
        <div className="bg-[#080d17] border border-slate-800 rounded-xl p-5 shadow-xl font-mono text-xs space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-cyan-400" />
            ZERO-LEAKAGE AIR-GAP PROTOCOL SPECIFICATION
          </h3>
          <p className="text-slate-400 leading-relaxed">
            The fundamental defense premise of Sentinel Link is that no operational metadata ever crosses into the public internet. Here is the exact data sanitization pipeline:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#05080e] p-4 rounded-lg border border-red-900/60">
              <div className="text-red-400 font-bold mb-2 flex items-center">
                <span>STAGE 1: TACTICAL RF PACKET</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• Source: Soldier Wearable (SX1262 LoRa)</li>
                <li>• Payload: MGRS Coordinates, SpO2, HR, Altitude</li>
                <li>• Encryption: AES-256-GCM + Ephemeral ECDH</li>
                <li>• Routing: Multi-hop mesh relay</li>
              </ul>
            </div>

            <div className="bg-[#05080e] p-4 rounded-lg border border-cyan-900/60">
              <div className="text-cyan-400 font-bold mb-2 flex items-center">
                <span>STAGE 2: AIR-GAP SANITIZATION</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• Hardware: Air-gapped battalion gateway</li>
                <li>• Action: 100% of GPS coordinates stripped</li>
                <li>• Action: Radio frequency / RSSI stripped</li>
                <li>• Signature: CO officer digital approval applied</li>
              </ul>
            </div>

            <div className="bg-[#05080e] p-4 rounded-lg border border-emerald-900/60">
              <div className="text-emerald-400 font-bold mb-2 flex items-center">
                <span>STAGE 3: CIVILIAN EGRESS</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• Target: Soldier Family Portal / SMS</li>
                <li>• Content: Safe / Healthy heartbeat status only</li>
                <li>• Threat surface: Zero GPS leak, Zero EW vulnerability</li>
                <li>• Result: Reassurance without tactical compromise</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: GitHub Collaboration Blueprint */}
      {activeSubTab === 'github' && (
        <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 shadow-xl font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">READY FOR GITHUB REPOSITORY & FRIEND COLLABORATION</h3>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold">
              OPEN COLLAB READY
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            You can push this repository directly to your GitHub profile and collaborate seamlessly with your friend.
            Here is the recommended distribution of responsibilities between you and your friend:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#05080e] p-4 rounded-lg border border-slate-800">
              <h4 className="text-cyan-400 font-bold mb-2 flex items-center">
                <Code className="w-4 h-4 mr-1.5" /> Track A: Edge-AI & Web Command (Your Role)
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• YOLOv8 border training pipeline (infiltrator vs mountain fauna)</li>
                <li>• React Tactical C2 Dashboard enhancement & map overlays</li>
                <li>• Air-gap cryptographic verification logic</li>
                <li>• iDEX pitch deck & competition presentations</li>
              </ul>
            </div>

            <div className="bg-[#05080e] p-4 rounded-lg border border-slate-800">
              <h4 className="text-emerald-400 font-bold mb-2 flex items-center">
                <Radio className="w-4 h-4 mr-1.5" /> Track B: Embedded LoRa & Hardware (Your Friend)
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• ESP32-S3 firmware + MAX30102 PPG vitals reading</li>
                <li>• Semtech SX1262 LoRa mesh packet handling & routing protocol</li>
                <li>• 3D printed rugged smartwatch enclosure & solar bezel</li>
                <li>• Field testing in mountainous / remote RF-restricted areas</li>
              </ul>
            </div>
          </div>

          {/* Quick Terminal Git Commands */}
          <div className="bg-black/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
            <div className="text-slate-500 mb-1"># Quick Git Setup to push to GitHub:</div>
            <div className="text-cyan-400">git init</div>
            <div className="text-cyan-400">git add .</div>
            <div className="text-cyan-400">git commit -m "feat: initial release of Sentinel Link - Edge-AI Border Defense & Mesh Network"</div>
            <div className="text-cyan-400">git branch -M main</div>
            <div className="text-cyan-400">git remote add origin https://github.com/your-username/sentinel-link.git</div>
            <div className="text-cyan-400">git push -u origin main</div>
          </div>
        </div>
      )}
    </div>
  );
};
