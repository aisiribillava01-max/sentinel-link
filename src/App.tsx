import React, { useState } from 'react';
import { 
  initialSystemMetrics, 
  initialMeshNodes, 
  initialThreatAlerts, 
  initialSoldierBiometrics, 
  sampleFamilyRelays 
} from './data/mockData';
import { ThreatAlert, MeshNode, SoldierBiometrics, FamilyRelayMessage } from './types';
import { Navbar } from './components/Navbar';
import { ThreatAlertModal } from './components/ThreatAlertModal';
import { CommandCenter } from './modules/CommandCenter';
import { EdgeAIVision } from './modules/EdgeAIVision';
import { MeshNetworkSim } from './modules/MeshNetworkSim';
import { WearableSOS } from './modules/WearableSOS';
import { FamilyRelay } from './modules/FamilyRelay';
import { SystemDocs } from './modules/SystemDocs';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [metrics, setMetrics] = useState(initialSystemMetrics);
  const [nodes, setNodes] = useState<MeshNode[]>(initialMeshNodes);
  const [threats, setThreats] = useState<ThreatAlert[]>(initialThreatAlerts);
  const [soldier, setSoldier] = useState<SoldierBiometrics>(initialSoldierBiometrics);
  const [relays, setRelays] = useState<FamilyRelayMessage[]>(sampleFamilyRelays);
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(null);
  const [activeModalThreat, setActiveModalThreat] = useState<ThreatAlert | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Synthesize Tactical Audio Cues using browser Web Audio API
  const playTacticalSound = (type: 'alert' | 'sos' | 'confirm') => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.setValueAtTime(440, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'sos') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(950, audioCtx.currentTime);
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  };

  // Toggle Jammed/Online status on a node
  const handleToggleNodeStatus = (nodeId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const nextStatus = node.status === 'ONLINE' ? 'JAMMED' : 'ONLINE';
        playTacticalSound(nextStatus === 'JAMMED' ? 'alert' : 'confirm');
        return { ...node, status: nextStatus };
      }
      return node;
    }));
  };

  // Handle Threat Verification from Human-in-the-Loop Dialog
  const handleVerifyThreat = (threatId: string, action: 'VERIFY' | 'DISMISS' | 'DISPATCH_QRF') => {
    playTacticalSound('confirm');
    setThreats(prev => prev.map(t => {
      if (t.id === threatId) {
        if (action === 'DISMISS') {
          return { ...t, status: 'DISMISSED_WILDLIFE', verified: true };
        } else if (action === 'DISPATCH_QRF') {
          return { ...t, status: 'QRF_DISPATCHED', verified: true };
        } else {
          return { ...t, status: 'VERIFIED_THREAT', verified: true };
        }
      }
      return t;
    }));
    setActiveModalThreat(null);
  };

  // Soldier Wearable SOS Trigger
  const handleTriggerSOS = (sosActive: boolean) => {
    playTacticalSound(sosActive ? 'sos' : 'confirm');
    setSoldier(prev => ({
      ...prev,
      isSosActive: sosActive,
      heartRate: sosActive ? 142 : 74,
      stressIndex: sosActive ? 92 : 28
    }));

    if (sosActive) {
      const sosAlert: ThreatAlert = {
        id: `SOS-IND-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        type: 'soldier_sos',
        confidence: 1.0,
        sector: 'Sector 4 - High Altitude Ridge Patrol Bravo',
        coordinates: {
          lat: soldier.coordinates.lat,
          lng: soldier.coordinates.lng,
          mgrs: soldier.coordinates.mgrs,
          elevation: soldier.altitude
        },
        cameraFeedId: 'SOL-WEARABLE-LORA',
        verified: false,
        status: 'ACTIVE_INVESTIGATION',
        details: `MAN-DOWN / CASUALTY BEACON ACTIVATED by Subedar Vikram. Heart rate spike (142 BPM), immediate SAR/QRF required.`,
        thermalSignature: 'HIGH_HUMAN',
        aiModelVersion: 'Wearable-LoRa-v1.8'
      };
      setThreats(prev => [sosAlert, ...prev]);
    }
  };

  // Simulate Fall / Man-Down
  const handleSimulateManDown = () => {
    handleTriggerSOS(true);
    setSoldier(prev => ({ ...prev, manDownDetected: true }));
  };

  // Toggle Stealth / Blackout Mode
  const handleToggleStealthMode = () => {
    playTacticalSound('confirm');
    setSoldier(prev => ({ ...prev, stealthMode: !prev.stealthMode }));
  };

  // Field Scenario Injections
  const handleSimulateThreat = (scenario: 'incursion' | 'wildlife' | 'soldier_sos' | 'jamming') => {
    if (scenario === 'incursion') {
      playTacticalSound('alert');
      const newThreat: ThreatAlert = {
        id: `TR-${Math.floor(8000 + Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        type: 'hostile_incursion',
        confidence: 0.954,
        sector: 'Sector 4 - Chumbi Approach Gap',
        coordinates: {
          lat: 27.3912,
          lng: 88.8354,
          mgrs: '45R XA 8354 3912',
          elevation: 4380
        },
        cameraFeedId: 'CAM-TWR-04-FLIR',
        verified: false,
        status: 'ACTIVE_INVESTIGATION',
        details: 'Armed trespasser profile detected breaching thermal perimeter. Automatic alert routed in 1.38s.',
        thermalSignature: 'HIGH_HUMAN',
        aiModelVersion: 'YOLOv8-Edge-Tactical-v3.2'
      };
      setThreats(prev => [newThreat, ...prev]);
      setActiveModalThreat(newThreat);
    } else if (scenario === 'wildlife') {
      playTacticalSound('confirm');
      const wildlifeAlert: ThreatAlert = {
        id: `WL-${Math.floor(5000 + Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        type: 'wildlife_filtered',
        confidence: 0.962,
        sector: 'Sector 2 - Dras Ridge Foothills',
        coordinates: {
          lat: 34.4285,
          lng: 75.7520,
          mgrs: '43S VB 7520 4285',
          elevation: 3290
        },
        cameraFeedId: 'CAM-TWR-02-OPTICAL',
        verified: true,
        status: 'DISMISSED_WILDLIFE',
        details: 'Snow Leopard & Ibex traverse detected. AI automatically suppressed false alarm.',
        thermalSignature: 'FAUNA_QUADRUPED',
        aiModelVersion: 'YOLOv8-Edge-Tactical-v3.2'
      };
      setThreats(prev => [wildlifeAlert, ...prev]);
    } else if (scenario === 'soldier_sos') {
      handleTriggerSOS(true);
    } else if (scenario === 'jamming') {
      handleToggleNodeStatus('NODE-RPT-02');
    }
  };

  return (
    <div className="min-h-screen bg-[#04080e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        latencyMs={metrics.alertLatencyMs}
        threatCount={threats.filter(t => t.status === 'ACTIVE_INVESTIGATION').length}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        triggerEmergencyDemo={() => handleTriggerSOS(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'command' && (
          <CommandCenter
            metrics={metrics}
            nodes={nodes}
            threats={threats}
            soldier={soldier}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            onOpenThreatModal={(threat) => setActiveModalThreat(threat)}
            onSimulateThreat={handleSimulateThreat}
          />
        )}

        {activeTab === 'edge-ai' && (
          <EdgeAIVision />
        )}

        {activeTab === 'mesh' && (
          <MeshNetworkSim
            nodes={nodes}
            onToggleNodeStatus={handleToggleNodeStatus}
          />
        )}

        {activeTab === 'wearable' && (
          <WearableSOS
            soldier={soldier}
            onTriggerSOS={handleTriggerSOS}
            onSimulateManDown={handleSimulateManDown}
            onToggleStealthMode={handleToggleStealthMode}
          />
        )}

        {activeTab === 'family-relay' && (
          <FamilyRelay
            relays={relays}
            soldier={soldier}
            onSendNewRelay={(msg) => setRelays(prev => [msg, ...prev])}
          />
        )}

        {activeTab === 'pitch-specs' && (
          <SystemDocs />
        )}
      </main>

      {/* Human-in-the-Loop Officer Verification Modal */}
      <ThreatAlertModal
        threat={activeModalThreat}
        onClose={() => setActiveModalThreat(null)}
        onVerify={handleVerifyThreat}
      />

      {/* Mil-Spec Bottom Status Strip */}
      <footer className="border-t border-slate-900 bg-black/80 px-4 py-2.5 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-cyan-400 font-bold">SENTINEL LINK v1.0-IND</span>
          <span>•</span>
          <span>SKIT BENGALURU • INVENTRA 2026 • DEFENCE & NATIONAL SECURITY</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="text-emerald-400">YOLOv8 Edge: ACTIVE</span>
          <span className="text-cyan-400">LoRa Mesh: 866.5 MHz</span>
          <span className="text-slate-400">AES-256 Air-Gap: ENFORCED</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
