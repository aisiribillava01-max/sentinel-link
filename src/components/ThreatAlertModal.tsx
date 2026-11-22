import React from 'react';
import { ThreatAlert } from '../types';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Radio, 
  Compass, 
  Clock,
  Layers
} from 'lucide-react';

interface ThreatAlertModalProps {
  threat: ThreatAlert | null;
  onClose: () => void;
  onVerify: (threatId: string, action: 'VERIFY' | 'DISMISS' | 'DISPATCH_QRF') => void;
}

export const ThreatAlertModal: React.FC<ThreatAlertModalProps> = ({
  threat,
  onClose,
  onVerify
}) => {
  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b121e] border-2 border-red-500/70 rounded-xl max-w-2xl w-full p-6 shadow-2xl shadow-red-950/60 relative hud-corner">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/50">
              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-widest">
                HUMAN-IN-THE-LOOP OFFICER VERIFICATION REQUIRED
              </span>
              <h2 className="text-xl font-black text-white font-mono tracking-wide">
                THREAT INCURSION ALERT • {threat.id}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Threat Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* AI Detection Info */}
          <div className="bg-[#060a12] p-4 rounded-lg border border-slate-800/80">
            <h4 className="text-xs font-mono font-bold text-cyan-400 mb-2 flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              EDGE-AI (YOLOv8) CLASSIFICATION
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Class Target:</span>
                <span className="text-white font-bold">{threat.type.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model Confidence:</span>
                <span className="text-emerald-400 font-bold">{(threat.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thermal Signature:</span>
                <span className="text-amber-300 font-bold">{threat.thermalSignature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sensor Mast ID:</span>
                <span className="text-cyan-300">{threat.cameraFeedId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Engine:</span>
                <span className="text-slate-300">{threat.aiModelVersion}</span>
              </div>
            </div>
          </div>

          {/* Tactical Geo Details */}
          <div className="bg-[#060a12] p-4 rounded-lg border border-slate-800/80">
            <h4 className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              TACTICAL GRID COORDINATES
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Sector:</span>
                <span className="text-white truncate max-w-[180px]">{threat.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MGRS Grid:</span>
                <span className="text-amber-400 font-bold">{threat.coordinates.mgrs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Altitude:</span>
                <span className="text-cyan-300">{threat.coordinates.elevation} m MSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lat / Long:</span>
                <span className="text-slate-300">{threat.coordinates.lat.toFixed(4)}°N, {threat.coordinates.lng.toFixed(4)}°E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Detection Time:</span>
                <span className="text-slate-300">{threat.timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="bg-[#080d17] p-3 rounded-lg border border-slate-800 text-xs text-slate-300 mb-6 font-mono leading-relaxed">
          <span className="text-cyan-400 font-bold">[RADAR & SENSOR INTEL SUMMARY]: </span>
          {threat.details}
        </div>

        {/* Human Officer Decision Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onVerify(threat.id, 'DISPATCH_QRF')}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs font-mono flex items-center justify-center space-x-2 shadow-lg shadow-red-950/80 transition-all border border-red-400/40"
          >
            <CheckCircle className="w-4 h-4" />
            <span>CONFIRM THREAT & DISPATCH QRF</span>
          </button>

          <button
            onClick={() => onVerify(threat.id, 'DISMISS')}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-lg text-xs font-mono flex items-center justify-center space-x-2 border border-slate-700 transition-all"
          >
            <XCircle className="w-4 h-4 text-emerald-400" />
            <span>CLASSIFY AS WILDLIFE (SUPPRESS)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs font-mono transition-all"
          >
            HOLD / CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
