import React, { useEffect, useRef } from 'react';
import { MeshNode, ThreatAlert } from '../types';

interface TacticalRadarProps {
  nodes: MeshNode[];
  threats: ThreatAlert[];
  selectedNodeId: string | null;
  onSelectNode: (node: MeshNode) => void;
  onSelectThreat?: (threat: ThreatAlert) => void;
  height?: number;
}

export const TacticalRadar: React.FC<TacticalRadarProps> = ({
  nodes,
  threats,
  selectedNodeId,
  onSelectNode,
  onSelectThreat,
  height = 360
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let heightVal = canvas.height;

    const render = () => {
      width = canvas.width;
      heightVal = canvas.height;
      const centerX = width / 2;
      const centerY = heightVal / 2;
      const radius = Math.min(centerX, centerY) - 20;

      // Dark tactical canvas background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, heightVal);

      // Radar rings
      ctx.lineWidth = 1;
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((scale, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
        ctx.strokeStyle = idx === rings.length - 1 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.15)';
        ctx.stroke();

        // Distance labels (km)
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.font = '10px monospace';
        ctx.fillText(`${(scale * 20).toFixed(0)} KM`, centerX + 4, centerY - radius * scale + 12);
      });

      // Azimuth crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Diagonal crosshairs
      const cos45 = Math.cos(Math.PI / 4) * radius;
      const sin45 = Math.sin(Math.PI / 4) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX - cos45, centerY - sin45);
      ctx.lineTo(centerX + cos45, centerY + sin45);
      ctx.moveTo(centerX - cos45, centerY + sin45);
      ctx.lineTo(centerX + cos45, centerY - sin45);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.stroke();

      // Cardinal points
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('N (000°)', centerX - 22, centerY - radius - 5);
      ctx.fillText('S (180°)', centerX - 22, centerY + radius + 15);
      ctx.fillText('E (090°)', centerX + radius + 5, centerY + 3);
      ctx.fillText('W (270°)', centerX - radius - 45, centerY + 3);

      // Radar Sweep Line and Phosphor Glow Cone
      angleRef.current = (angleRef.current + 0.02) % (Math.PI * 2);
      const sweepAngle = angleRef.current;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0.01)');

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle - 0.45, sweepAngle, false);
      ctx.closePath();
      const sweepGradient = ctx.createConicGradient(sweepAngle - 0.45, centerX, centerY);
      sweepGradient.addColorStop(0, 'rgba(0, 240, 255, 0)');
      sweepGradient.addColorStop(0.07, 'rgba(0, 240, 255, 0.22)');
      sweepGradient.addColorStop(0.075, 'rgba(0, 255, 136, 0.7)');
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Main sweep needle line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * radius, centerY + Math.sin(sweepAngle) * radius);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw Mesh Links between nodes
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        const nx = centerX + ((node.x - 50) / 50) * radius * 0.88;
        const ny = centerY + ((node.y - 50) / 50) * radius * 0.88;

        node.connectedPeers.forEach((peerId) => {
          const peer = nodes.find(n => n.id === peerId);
          if (peer) {
            const px = centerX + ((peer.x - 50) / 50) * radius * 0.88;
            const py = centerY + ((peer.y - 50) / 50) * radius * 0.88;

            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(px, py);
            ctx.strokeStyle = node.status === 'JAMMED' || peer.status === 'JAMMED'
              ? 'rgba(255, 51, 68, 0.3)'
              : 'rgba(0, 240, 255, 0.25)';
            ctx.setLineDash([2, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });

      // Render Nodes
      nodes.forEach((node) => {
        const nx = centerX + ((node.x - 50) / 50) * radius * 0.88;
        const ny = centerY + ((node.y - 50) / 50) * radius * 0.88;
        const isSelected = node.id === selectedNodeId;

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(nx, ny, 11, 0, Math.PI * 2);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node blip
        ctx.beginPath();
        const blipRadius = node.type === 'BASE_STATION' ? 6 : 4.5;
        ctx.arc(nx, ny, blipRadius, 0, Math.PI * 2);

        if (node.status === 'JAMMED') {
          ctx.fillStyle = '#ff3344';
        } else if (node.type === 'BASE_STATION') {
          ctx.fillStyle = '#00f0ff';
        } else if (node.type === 'EDGE_SENSOR') {
          ctx.fillStyle = '#ffaa00';
        } else if (node.type === 'SOLDIER_WEARABLE') {
          ctx.fillStyle = '#00ff88';
        } else {
          ctx.fillStyle = '#38bdf8';
        }
        ctx.fill();

        // Node label
        ctx.fillStyle = isSelected ? '#00f0ff' : 'rgba(226, 232, 240, 0.75)';
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        const shortName = node.callsign.split(' ')[0];
        ctx.fillText(shortName, nx + 7, ny + 3);
      });

      // Render Threat Incursion Blips
      threats.forEach((threat) => {
        if (threat.status === 'DISMISSED_WILDLIFE') return; // Don't clutter radar with dismissed wildlife

        // Coordinate projection roughly on radar relative to sector
        const tx = centerX + 0.45 * radius;
        const ty = centerY - 0.52 * radius;

        // Pulsing alert ring
        const pulse = (Math.sin(Date.now() / 200) + 1) * 4;
        ctx.beginPath();
        ctx.arc(tx, ty, 6 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = threat.type === 'unauthorized_uav' ? 'rgba(255, 170, 0, 0.8)' : 'rgba(255, 51, 68, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fillStyle = threat.type === 'unauthorized_uav' ? '#ffaa00' : '#ff3344';
        ctx.fill();

        // Threat text
        ctx.fillStyle = '#ff3344';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`! ${threat.id} [${(threat.confidence * 100).toFixed(0)}%]`, tx + 9, ty - 2);
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, threats, selectedNodeId]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Check if clicked near a node
    for (const node of nodes) {
      const nx = centerX + ((node.x - 50) / 50) * radius * 0.88;
      const ny = centerY + ((node.y - 50) / 50) * radius * 0.88;
      const dist = Math.hypot(clickX - nx, clickY - ny);
      if (dist < 15) {
        onSelectNode(node);
        return;
      }
    }
  };

  return (
    <div className="relative border border-cyan-900/50 bg-[#060a12] rounded-lg overflow-hidden shadow-2xl">
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-black/70 px-2 py-1 rounded border border-cyan-800/60">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>RADAR POLAR GRID • R: 20 KM</span>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center space-x-3 text-[10px] font-mono text-slate-400 bg-black/70 px-2.5 py-1 rounded border border-slate-800">
        <span className="flex items-center text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-1"></span>HQ</span>
        <span className="flex items-center text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1"></span>Edge-AI</span>
        <span className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>Patrol</span>
        <span className="flex items-center text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 mr-1"></span>Threat</span>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        onClick={handleCanvasClick}
        className="w-full cursor-crosshair block"
      />

      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
        CLICK ANY NODE OR THREAT BLIP TO VIEW REAL-TIME TELEMETRY
      </div>
    </div>
  );
};
