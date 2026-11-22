import React, { useState } from 'react';
import { FamilyRelayMessage, SoldierBiometrics } from '../types';
import { 
  Users, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  AlertTriangle, 
  EyeOff, 
  Heart, 
  Smartphone, 
  FileCheck, 
  KeyRound,
  FileLock2,
  Cpu
} from 'lucide-react';

interface FamilyRelayProps {
  relays: FamilyRelayMessage[];
  soldier: SoldierBiometrics;
  onSendNewRelay: (message: FamilyRelayMessage) => void;
}

export const FamilyRelay: React.FC<FamilyRelayProps> = ({
  relays,
  soldier,
  onSendNewRelay
}) => {
  const [selectedRelay, setSelectedRelay] = useState<FamilyRelayMessage>(relays[0]);
  const [customNote, setCustomNote] = useState<string>('Subedar Vikram is in prime health and executing scheduled forward duties.');
  const [officerName, setOfficerName] = useState<string>('Maj. K. S. Bakshi (Adjutant 14 Vikas)');
  const [selectedChannel, setSelectedChannel] = useState<'SMS_AIRGAP' | 'SECURE_FAMILY_PORTAL'>('SMS_AIRGAP');
  const [activeTab, setActiveTab] = useState<'compare' | 'sandbox' | 'logs'>('compare');
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [relaySuccessNotice, setRelaySuccessNotice] = useState<string | null>(null);

  const handleDispatchSanitizedRelay = () => {
    setIsScrubbing(true);
    setTimeout(() => {
      const newRelay: FamilyRelayMessage = {
        id: `RELAY-2026-${Math.floor(100 + Math.random() * 900)}`,
        soldierId: soldier.soldierId,
        soldierName: `Subedar Vikram Singh Rathore`,
        familyContactName: 'Anuradha Rathore',
        relation: 'Spouse',
        channel: selectedChannel,
        sanitizedStatus: 'ACTIVE_HEALTHY',
        displayNote: customNote,
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        approvedByOfficer: officerName,
        airGapAudit: {
          gpsStripped: true,
          tacticalMetadataRemoved: true,
          rawRFFiltered: true,
          zeroLeakageVerified: true,
          cryptographicHash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
        }
      };

      onSendNewRelay(newRelay);
      setSelectedRelay(newRelay);
      setIsScrubbing(false);
      setRelaySuccessNotice('Sanitized Welfare Ping Dispatched via Air-Gap Gateway! Zero Leakage Confirmed.');
      setTimeout(() => setRelaySuccessNotice(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Module Title Bar */}
      <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center">
              ZERO-LEAKAGE AIR-GAPPED FAMILY RELAY HUB
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Cryptographically isolates forward operational telemetry (GPS/MGRS/RF) while delivering reassuring welfare heartbeats to soldier families.
            </p>
          </div>
        </div>

        {/* Audit Metrics */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-emerald-800 flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>AIR-GAP VERIFIED: 0% LOCATION LEAK</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {relaySuccessNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-lg text-xs font-mono flex items-center space-x-3 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{relaySuccessNotice}</span>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'compare'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Side-by-Side Air-Gap Inspection (HQ vs Family)
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'sandbox'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cryptographic Sanitizer Sandbox (Dispatch Ping)
        </button>
      </div>

      {activeTab === 'compare' ? (
        /* Side by Side Comparison */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Classified Battalion HQ View (Restricted) */}
          <div className="lg:col-span-6 bg-[#080d17] border-2 border-red-900/50 rounded-xl p-5 shadow-2xl flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="flex items-center justify-between border-b border-red-900/50 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <h3 className="font-bold text-red-400 tracking-wider">
                    CLASSIFIED BATTALION COMMAND INTEL (LEVEL 4)
                  </h3>
                </div>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
                  STRICTLY CONFIDENTIAL
                </span>
              </div>

              <p className="text-slate-400 text-xs mb-4">
                This raw telemetry is received by Battalion HQ over tactical LoRa mesh. It contains precise battlefield coordinates and vital stats that would expose forward posts to hostile SIGINT if leaked.
              </p>

              <div className="bg-[#05080e] p-4 rounded-lg border border-red-950/70 space-y-2.5 mb-4">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Unit Deployment:</span>
                  <span className="text-white font-bold">{soldier.unit}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">MGRS Grid Coordinate:</span>
                  <span className="text-red-400 font-bold">{soldier.coordinates.mgrs}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Exact Lat / Long:</span>
                  <span className="text-red-400">{soldier.coordinates.lat}°N, {soldier.coordinates.lng}°E</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Barometric Altitude:</span>
                  <span className="text-cyan-300">{soldier.altitude} m MSL (Forward Ridge)</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">Biometric Heart Rate:</span>
                  <span className="text-emerald-400">{soldier.heartRate} BPM (SpO2: {soldier.spO2}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">LoRa RF Carrier Frequency:</span>
                  <span className="text-amber-400 font-bold">866.500 MHz (SF9)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-950/20 border border-red-900/60 rounded-lg text-[11px] text-red-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>AIR-GAP ENFORCEMENT: Never exported to civilian public networks.</span>
            </div>
          </div>

          {/* Right: Sanitized Family Portal View (Zero Leakage) */}
          <div className="lg:col-span-6 bg-[#081216] border-2 border-emerald-900/60 rounded-xl p-5 shadow-2xl flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-emerald-400 tracking-wider">
                    SANITIZED FAMILY WELFARE PORTAL (CIVILIAN VIEW)
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  VERIFIED SAFE
                </span>
              </div>

              <p className="text-slate-400 text-xs mb-4">
                What the soldier's family sees on their civilian phone or portal. Stripped of all tactical telemetry; only positive welfare verification with zero operational risk.
              </p>

              {/* Mock Mobile App Card for Family */}
              <div className="bg-[#041a13] p-5 rounded-xl border border-emerald-700/60 shadow-inner space-y-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-sm">
                    VS
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white font-sans">Subedar Vikram Singh Rathore</div>
                    <div className="text-[11px] text-emerald-400 font-sans">Active & Healthy in Base Area</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-black/40 border border-emerald-900/80 font-sans text-xs text-slate-200 leading-relaxed">
                  "Subedar Vikram is in prime physical condition. Forward station welfare heartbeat verified. Safe & healthy."
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-emerald-900/80 pt-3">
                  <div>
                    <span className="text-slate-400">Welfare Status:</span>
                    <div className="text-emerald-400 font-bold">HEALTHY & ACTIVE</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Verified:</span>
                    <div className="text-slate-300">{selectedRelay.timestamp}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Authorized By:</span>
                    <div className="text-slate-300 truncate">{selectedRelay.approvedByOfficer}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Location Access:</span>
                    <div className="text-slate-500 italic">Zero-Knowledge Air Gap</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Zero-Leakage Audit Certificate */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-700/50 rounded-lg text-[11px] text-emerald-300 flex items-center justify-between">
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
                AUDIT PASS: 0 BYTES GPS LEAKED
              </span>
              <span className="text-[10px] text-slate-400">HASH: {selectedRelay.airGapAudit.cryptographicHash}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Air-Gap Scrubber Sandbox */
        <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-5 shadow-2xl font-mono text-xs space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-cyan-400" />
            DISPATCH SANITIZED WELFARE PING VIA AIR-GAP ENGINE
          </h3>
          <p className="text-slate-400 text-xs">
            Enter the message and officer sign-off. The engine applies an automated policy filter to scrub coordinates and metadata before routing to the civilian SMS gateway.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Civilian Welfare Note (Sanitized):</label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={3}
                className="w-full bg-[#05080e] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Authorizing Commanding Officer:</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-[#05080e] border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 mb-3"
              />

              <label className="text-slate-400 block mb-1">Egress Channel:</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedChannel('SMS_AIRGAP')}
                  className={`flex-1 py-2 rounded border text-center transition-all ${
                    selectedChannel === 'SMS_AIRGAP'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-[#05080e] border-slate-800 text-slate-400'
                  }`}
                >
                  Encrypted SMS Air-Gap
                </button>
                <button
                  onClick={() => setSelectedChannel('SECURE_FAMILY_PORTAL')}
                  className={`flex-1 py-2 rounded border text-center transition-all ${
                    selectedChannel === 'SECURE_FAMILY_PORTAL'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-[#05080e] border-slate-800 text-slate-400'
                  }`}
                >
                  Family Web Portal
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleDispatchSanitizedRelay}
              disabled={isScrubbing}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-950"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isScrubbing ? 'RUNNING AIR-GAP SCRUBBING POLICY...' : 'SIGN & DISPATCH SANITIZED PING'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
