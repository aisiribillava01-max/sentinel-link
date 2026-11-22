import React, { useState, useEffect, useRef } from 'react';
import { MeshNode, MeshPacket } from '../types';
import { 
  Radio, 
  Send, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  Lock, 
  Activity, 
  ArrowRight,
  WifiOff
} from 'lucide-react';

interface MeshNetworkSimProps {
  nodes: MeshNode[];
  onToggleNodeStatus: (nodeId: string) => void;
}

export const MeshNetworkSim: React.FC<MeshNetworkSimProps> = ({
  nodes,
  onToggleNodeStatus
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedSourceNodeId, setSelectedSourceNodeId] = useState<string>('NODE-SOL-01');
  const [packetsInFlight, setPacketsInFlight] = useState<any[]>([]);
  const [packetHistory, setPacketHistory] = useState<any[]>([
    {
      id: 'PKT-9041',
      source: 'NODE-SOL-01',
      destination: 'NODE-HQ-01',
      route: ['NODE-SOL-01', 'NODE-RPT-02', 'NODE-HQ-01'],
      type: 'BIOMETRIC_HEARTBEAT',
      latency: '1.24s',
      status: 'DELIVERED',
      encryptedPayload: '0x4A8F90C12E338BA7C942D8E1F0338A9B55C0E9',
      decryptedData: { hr: 74, spo2: 97, alt: 3820, status: 'NOMINAL' }
    },
    {
      id: 'PKT-9040',
      source: 'NODE-CAM-01',
      destination: 'NODE-HQ-01',
      route: ['NODE-CAM-01', 'NODE-RPT-01', 'NODE-HQ-01'],
      type: 'EDGE_INTRUSION_ALERT',
      latency: '1.41s',
      status: 'DELIVERED',
      encryptedPayload: '0x88EF2104AA55B39120CD7E99A0413B82049187',
      decryptedData: { event: 'HUMAN_DETECTED', conf: 0.942, sector: 'SEC-4' }
    }
  ]);
  const [selectedPacket, setSelectedPacket] = useState<any>(packetHistory[0]);

  // Handle packet animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Dark tactical grid canvas
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 1. Draw Links between connected nodes
      nodes.forEach((node) => {
        const nx = (node.x / 100) * w;
        const ny = (node.y / 100) * h;

        node.connectedPeers.forEach((peerId) => {
          const peer = nodes.find(n => n.id === peerId);
          if (peer) {
            const px = (peer.x / 100) * w;
            const py = (peer.y / 100) * h;

            const isBlocked = node.status === 'JAMMED' || peer.status === 'JAMMED';

            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(px, py);
            ctx.strokeStyle = isBlocked ? 'rgba(255, 51, 68, 0.3)' : 'rgba(0, 240, 255, 0.2)';
            ctx.lineWidth = isBlocked ? 1 : 1.5;
            if (isBlocked) ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Link RSSI badge midway
            if (!isBlocked && (node.type === 'BASE_STATION' || peer.type === 'BASE_STATION')) {
              const mx = (nx + px) / 2;
              const my = (ny + py) / 2;
              ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
              ctx.font = '9px monospace';
              ctx.fillText(`${node.rssi} dBm`, mx - 15, my - 4);
            }
          }
        });
      });

      // 2. Draw Nodes
      nodes.forEach((node) => {
        const nx = (node.x / 100) * w;
        const ny = (node.y / 100) * h;
        const isSelected = node.id === selectedSourceNodeId;

        // Selection Aura
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(nx, ny, 16, 0, Math.PI * 2);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // RF Coverage Ripple
        if (node.status === 'ONLINE') {
          const pulse = (Math.sin(Date.now() / 350 + node.x) + 1) * 3;
          ctx.beginPath();
          ctx.arc(nx, ny, 10 + pulse, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
          ctx.stroke();
        }

        // Node Circle Body
        ctx.beginPath();
        const radius = node.type === 'BASE_STATION' ? 10 : 8;
        ctx.arc(nx, ny, radius, 0, Math.PI * 2);

        if (node.status === 'JAMMED') {
          ctx.fillStyle = '#ff3344';
        } else if (node.type === 'BASE_STATION') {
          ctx.fillStyle = '#00f0ff';
        } else if (node.type === 'SOLDIER_WEARABLE') {
          ctx.fillStyle = '#00ff88';
        } else if (node.type === 'EDGE_SENSOR') {
          ctx.fillStyle = '#ffaa00';
        } else {
          ctx.fillStyle = '#38bdf8';
        }
        ctx.fill();

        // Node Label
        ctx.fillStyle = isSelected ? '#00f0ff' : 'rgba(255, 255, 255, 0.85)';
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        const label = node.callsign.split(' ')[0];
        ctx.fillText(label, nx + 12, ny + 3);

        if (node.status === 'JAMMED') {
          ctx.fillStyle = '#ff3344';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('[JAMMED]', nx + 12, ny + 13);
        }
      });

      // 3. Draw Packets In Flight
      setPacketsInFlight((currentPackets) => {
        const nextPackets: any[] = [];

        currentPackets.forEach((pkt) => {
          pkt.progress += 0.025; // Speed of propagation

          const fromNode = nodes.find(n => n.id === pkt.fromId);
          const toNode = nodes.find(n => n.id === pkt.toId);

          if (fromNode && toNode) {
            const x1 = (fromNode.x / 100) * w;
            const y1 = (fromNode.y / 100) * h;
            const x2 = (toNode.x / 100) * w;
            const y2 = (toNode.y / 100) * h;

            const currX = x1 + (x2 - x1) * pkt.progress;
            const currY = y1 + (y2 - y1) * pkt.progress;

            // Draw glowing packet beacon
            ctx.beginPath();
            ctx.arc(currX, currY, 5, 0, Math.PI * 2);
            ctx.fillStyle = pkt.type === 'SOS' ? '#ff3344' : '#00ff88';
            ctx.shadowColor = pkt.type === 'SOS' ? '#ff3344' : '#00ff88';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (pkt.progress < 1) {
              nextPackets.push(pkt);
            } else {
              // Packet reached hop: check if more hops remain
              if (pkt.hopIndex + 1 < pkt.route.length - 1) {
                nextPackets.push({
                  ...pkt,
                  progress: 0,
                  hopIndex: pkt.hopIndex + 1,
                  fromId: pkt.route[pkt.hopIndex + 1],
                  toId: pkt.route[pkt.hopIndex + 2]
                });
              }
            }
          }
        });

        return nextPackets;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [nodes, selectedSourceNodeId]);

  // Transmit a live RF packet across the mesh
  const transmitTestPacket = (type: 'SOS' | 'TELEMETRY' = 'TELEMETRY') => {
    const srcNode = nodes.find(n => n.id === selectedSourceNodeId);
    if (!srcNode) return;

    // Dynamically calculate route to HQ avoiding jammed nodes (Self-Healing Mesh)
    let calculatedRoute: string[] = [];

    if (srcNode.id === 'NODE-HQ-01') {
      calculatedRoute = ['NODE-HQ-01'];
    } else {
      // Find valid path from source to NODE-HQ-01
      // Check if primary repeater (RPT-02 or RPT-01) is online
      const rpt1 = nodes.find(n => n.id === 'NODE-RPT-01');
      const rpt2 = nodes.find(n => n.id === 'NODE-RPT-02');
      const rpt3 = nodes.find(n => n.id === 'NODE-RPT-03');

      if (srcNode.id === 'NODE-SOL-01' || srcNode.id === 'NODE-SOL-02') {
        if (rpt2 && rpt2.status === 'ONLINE') {
          calculatedRoute = [srcNode.id, 'NODE-RPT-02', 'NODE-HQ-01'];
        } else if (rpt1 && rpt1.status === 'ONLINE') {
          // SELF-HEALING: Reroute via RPT-01 if RPT-02 is jammed!
          calculatedRoute = [srcNode.id, 'NODE-RPT-03', 'NODE-RPT-01', 'NODE-HQ-01'];
        } else {
          calculatedRoute = [srcNode.id, 'NODE-HQ-01'];
        }
      } else if (srcNode.id.includes('CAM')) {
        if (rpt1 && rpt1.status === 'ONLINE') {
          calculatedRoute = [srcNode.id, 'NODE-RPT-01', 'NODE-HQ-01'];
        } else if (rpt3 && rpt3.status === 'ONLINE' && rpt2 && rpt2.status === 'ONLINE') {
          calculatedRoute = [srcNode.id, 'NODE-RPT-03', 'NODE-RPT-02', 'NODE-HQ-01'];
        } else {
          calculatedRoute = [srcNode.id, 'NODE-HQ-01'];
        }
      } else {
        calculatedRoute = [srcNode.id, 'NODE-RPT-01', 'NODE-HQ-01'];
      }
    }

    if (calculatedRoute.length < 2) return;

    const newPkt = {
      id: `PKT-${Math.floor(1000 + Math.random() * 9000)}`,
      source: srcNode.id,
      destination: 'NODE-HQ-01',
      route: calculatedRoute,
      type: type === 'SOS' ? 'SOLDIER_SOS_EMERGENCY' : 'BIOMETRIC_TELEMETRY',
      latency: `${(0.8 + Math.random() * 0.7).toFixed(2)}s`,
      status: 'DELIVERED',
      encryptedPayload: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase(),
      decryptedData: {
        timestamp: new Date().toLocaleTimeString(),
        sourceCallsign: srcNode.callsign,
        battery: `${srcNode.battery}%`,
        rssi: `${srcNode.rssi} dBm`,
        snr: `+${srcNode.snr} dB`,
        hopsTaken: calculatedRoute.length - 1,
        meshSelfHealed: calculatedRoute.includes('NODE-RPT-03') && calculatedRoute.length > 3
      }
    };

    // Add to animation queue
    setPacketsInFlight(prev => [
      ...prev,
      {
        id: newPkt.id,
        progress: 0,
        hopIndex: 0,
        fromId: calculatedRoute[0],
        toId: calculatedRoute[1],
        route: calculatedRoute,
        type: type
      }
    ]);

    setPacketHistory(prev => [newPkt, ...prev.slice(0, 7)]);
    setSelectedPacket(newPkt);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/40">
            <Radio className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center">
              TACTICAL LoRa / RF MESH TOPOLOGY SIMULATOR
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Offline-first, self-healing sub-GHz wireless mesh routing with AES-256-GCM hardware encryption.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => transmitTestPacket('TELEMETRY')}
            className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs flex items-center space-x-2 shadow-lg shadow-cyan-950 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>TRANSMIT RF PACKET</span>
          </button>

          <button
            onClick={() => transmitTestPacket('SOS')}
            className="px-3 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/60 text-red-300 font-bold font-mono text-xs flex items-center space-x-2 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>TRANSMIT SOS OVER MESH</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas & Packet Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Canvas & Node Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative bg-[#060a12] border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl">
            <canvas
              ref={canvasRef}
              width={650}
              height={400}
              className="w-full h-auto block cursor-pointer"
              onClick={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const w = canvas.width;
                const h = canvas.height;

                for (const node of nodes) {
                  const nx = (node.x / 100) * w;
                  const ny = (node.y / 100) * h;
                  const dist = Math.hypot(clickX - nx, clickY - ny);
                  if (dist < 20) {
                    setSelectedSourceNodeId(node.id);
                    break;
                  }
                }
              }}
            />

            <div className="absolute top-3 left-3 bg-black/75 px-2.5 py-1 rounded border border-cyan-800/60 text-[11px] font-mono text-cyan-400">
              CLICK ANY NODE TO SELECT SOURCE TRANSMITTER
            </div>

            <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 rounded border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center space-x-4">
              <span>FREQ: 866.5 MHz (IND ISM)</span>
              <span>BW: 125 kHz</span>
              <span>SF: 9</span>
              <span>TX PWR: +22 dBm</span>
            </div>
          </div>

          {/* Node Status & Jamming Simulation Strip */}
          <div className="bg-[#080d17] p-3 rounded-lg border border-slate-800">
            <div className="text-xs font-mono text-slate-300 font-bold mb-2 flex items-center justify-between">
              <span>ACTIVE MESH REPEATER CONTROLS:</span>
              <span className="text-[10px] text-amber-400">TOGGLE JAMMED TO TEST SELF-HEALING</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {nodes.filter(n => n.type === 'REPEATER_TOWER').map(node => (
                <button
                  key={node.id}
                  onClick={() => onToggleNodeStatus(node.id)}
                  className={`p-2 rounded border text-left text-xs font-mono transition-all flex items-center justify-between ${
                    node.status === 'ONLINE'
                      ? 'bg-emerald-950/20 border-emerald-800 text-slate-200 hover:border-red-500'
                      : 'bg-red-950/40 border-red-600 text-red-300'
                  }`}
                >
                  <div className="truncate pr-1">
                    <div className="font-bold text-[11px]">{node.callsign.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-400">{node.status}</div>
                  </div>
                  {node.status === 'ONLINE' ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300">ONLINE</span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/80 text-red-200 animate-pulse">JAMMED</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AES-256 Frame Inspector & Packet Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          {/* AES-256 Packet Frame Inspector */}
          <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-4 shadow-xl">
            <h3 className="font-bold text-white mb-3 flex items-center justify-between">
              <span className="flex items-center text-cyan-400">
                <Lock className="w-4 h-4 mr-1.5" />
                AES-256-GCM FRAME INSPECTOR
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                HARDWARE ENCRYPTED
              </span>
            </h3>

            {selectedPacket ? (
              <div className="space-y-2.5">
                <div className="bg-[#05080e] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-1">CIPHERTEXT TRANSMITTED OVER AIR (RF):</div>
                  <div className="font-mono text-[11px] text-cyan-300 break-all bg-black/60 p-2 rounded border border-cyan-950">
                    {selectedPacket.encryptedPayload}
                  </div>
                </div>

                <div className="bg-[#05080e] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-1">DECRYPTED TELEMETRY AT BASE HQ:</div>
                  <pre className="font-mono text-[11px] text-emerald-400 bg-black/60 p-2 rounded border border-emerald-950/60 overflow-x-auto">
                    {JSON.stringify(selectedPacket.decryptedData, null, 2)}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#05080e] p-2 rounded border border-slate-800">
                    <span className="text-slate-400">Route: </span>
                    <span className="text-white font-bold">{selectedPacket.route.join(' → ')}</span>
                  </div>
                  <div className="bg-[#05080e] p-2 rounded border border-slate-800">
                    <span className="text-slate-400">Latency: </span>
                    <span className="text-cyan-400 font-bold">{selectedPacket.latency}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500">No packet selected</div>
            )}
          </div>

          {/* Packet History List */}
          <div className="bg-[#080d17] border border-slate-800 rounded-xl p-4 shadow-xl">
            <h3 className="font-bold text-slate-300 mb-2 flex items-center justify-between text-xs">
              <span>RECENT MESH PACKET LOGS</span>
              <span className="text-[10px] text-slate-500">{packetHistory.length} LOGGED</span>
            </h3>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {packetHistory.map((pkt) => (
                <div
                  key={pkt.id}
                  onClick={() => setSelectedPacket(pkt)}
                  className={`p-2 rounded border cursor-pointer transition-all flex items-center justify-between text-[11px] ${
                    selectedPacket && selectedPacket.id === pkt.id
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-white'
                      : 'bg-[#060a12] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${pkt.type.includes('SOS') ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                    <span className="font-bold">{pkt.id}</span>
                    <span className="text-slate-500 text-[10px]">{pkt.source}</span>
                  </div>
                  <span className="text-cyan-300">{pkt.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
