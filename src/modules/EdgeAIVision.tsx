import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  ShieldCheck, 
  Camera, 
  Sliders, 
  Layers, 
  Zap, 
  AlertTriangle, 
  Crosshair, 
  Maximize2, 
  RefreshCw, 
  Sun, 
  Moon, 
  Flame,
  CheckCircle2,
  XCircle,
  Cpu
} from 'lucide-react';

interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  type: 'hostile' | 'friendly' | 'wildlife' | 'uav';
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  thermalValue: number; // 0 - 100
}

export const EdgeAIVision: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeCamera, setActiveCamera] = useState<string>('CAM-TWR-04-FLIR');
  const [visionMode, setVisionMode] = useState<'thermal' | 'optical' | 'nvg' | 'wireframe'>('thermal');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [wildlifeFilterEnabled, setWildlifeFilterEnabled] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(38);
  const [detectionsCount, setDetectionsCount] = useState<{ total: number; hostile: number; wildlife: number; suppressed: number }>({
    total: 3,
    hostile: 1,
    wildlife: 2,
    suppressed: 2
  });

  // Dynamic moving bounding boxes simulating real-time video stream detection
  const boxesRef = useRef<BoundingBox[]>([
    {
      id: 'box-1',
      label: 'Hostile Infiltrator',
      confidence: 94.2,
      type: 'hostile',
      x: 180,
      y: 190,
      width: 70,
      height: 120,
      dx: 0.35,
      dy: 0.1,
      thermalValue: 88
    },
    {
      id: 'box-2',
      label: 'Himalayan Ibex (Fauna)',
      confidence: 96.8,
      type: 'wildlife',
      x: 420,
      y: 220,
      width: 85,
      height: 80,
      dx: -0.4,
      dy: 0.15,
      thermalValue: 62
    },
    {
      id: 'box-3',
      label: 'Low-RCS Micro UAV',
      confidence: 91.5,
      type: 'uav',
      x: 310,
      y: 70,
      width: 55,
      height: 40,
      dx: 0.6,
      dy: -0.2,
      thermalValue: 45
    }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Simulated Background Terrain based on Vision Mode
      if (visionMode === 'thermal') {
        // FLIR Thermal: Dark blue/purple gradient with hot thermal mountain contours
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a0818');
        grad.addColorStop(0.6, '#180e29');
        grad.addColorStop(1, '#0c0714');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Mountain ridge silhouettes in thermal purple
        ctx.beginPath();
        ctx.moveTo(0, h * 0.65);
        ctx.lineTo(w * 0.25, h * 0.45);
        ctx.lineTo(w * 0.55, h * 0.58);
        ctx.lineTo(w * 0.8, h * 0.38);
        ctx.lineTo(w, h * 0.5);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = 'rgba(76, 29, 149, 0.4)';
        ctx.fill();

        // Foreground rocky ledge
        ctx.beginPath();
        ctx.moveTo(0, h * 0.85);
        ctx.lineTo(w * 0.4, h * 0.75);
        ctx.lineTo(w * 0.7, h * 0.82);
        ctx.lineTo(w, h * 0.78);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = 'rgba(46, 16, 101, 0.6)';
        ctx.fill();

      } else if (visionMode === 'nvg') {
        // NVG: High contrast green phosphor night vision
        ctx.fillStyle = '#021208';
        ctx.fillRect(0, 0, w, h);

        ctx.beginPath();
        ctx.moveTo(0, h * 0.65);
        ctx.lineTo(w * 0.3, h * 0.48);
        ctx.lineTo(w * 0.6, h * 0.55);
        ctx.lineTo(w * 0.85, h * 0.42);
        ctx.lineTo(w, h * 0.52);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = 'rgba(5, 46, 22, 0.7)';
        ctx.fill();

        // Noise grain overlay
        ctx.fillStyle = 'rgba(0, 255, 100, 0.04)';
        for (let i = 0; i < 400; i++) {
          ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
        }

      } else if (visionMode === 'optical') {
        // High altitude snow pass day optical
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(0.5, '#334155');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Snow peaks
        ctx.beginPath();
        ctx.moveTo(0, h * 0.6);
        ctx.lineTo(w * 0.3, h * 0.4);
        ctx.lineTo(w * 0.5, h * 0.52);
        ctx.lineTo(w * 0.8, h * 0.35);
        ctx.lineTo(w, h * 0.48);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.2)';
        ctx.fill();

      } else {
        // Wireframe / Neural Activation mode
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, w, h);

        // Neural grid lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      // 2. Animate and Render Bounding Boxes
      boxesRef.current.forEach((box) => {
        // Bounce within boundaries
        box.x += box.dx;
        box.y += box.dy;
        if (box.x < 30 || box.x + box.width > w - 30) box.dx *= -1;
        if (box.y < 40 || box.y + box.height > h - 40) box.dy *= -1;

        const isSuppressed = box.type === 'wildlife' && wildlifeFilterEnabled;
        const meetsConfidence = box.confidence >= confidenceThreshold;

        if (!meetsConfidence) return;

        // Draw Entity representation on canvas
        if (visionMode === 'thermal') {
          // Heat bloom inside bounding box
          const heatGrad = ctx.createRadialGradient(
            box.x + box.width / 2, box.y + box.height / 2, 5,
            box.x + box.width / 2, box.y + box.height / 2, box.width / 2
          );
          if (box.type === 'hostile') {
            heatGrad.addColorStop(0, '#ffffff');
            heatGrad.addColorStop(0.4, '#ffaa00');
            heatGrad.addColorStop(1, 'rgba(255, 51, 68, 0)');
          } else if (box.type === 'wildlife') {
            heatGrad.addColorStop(0, '#fef08a');
            heatGrad.addColorStop(0.5, '#ea580c');
            heatGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          } else {
            heatGrad.addColorStop(0, '#e0f2fe');
            heatGrad.addColorStop(0.5, '#0284c7');
            heatGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          }
          ctx.fillStyle = heatGrad;
          ctx.fillRect(box.x, box.y, box.width, box.height);
        }

        // YOLOv8 Bounding Box Outline
        ctx.lineWidth = isSuppressed ? 1 : 2;
        if (isSuppressed) {
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.7)';
          ctx.setLineDash([4, 4]);
        } else if (box.type === 'hostile') {
          ctx.strokeStyle = '#ff3344';
          ctx.setLineDash([]);
        } else if (box.type === 'uav') {
          ctx.strokeStyle = '#ffaa00';
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = '#00ff88';
          ctx.setLineDash([]);
        }

        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.setLineDash([]);

        // Corner brackets on bounding box (YOLO tactical HUD style)
        const cornerSize = 8;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isSuppressed ? '#64748b' : box.type === 'hostile' ? '#ff3344' : '#00f0ff';
        // Top-left
        ctx.beginPath();
        ctx.moveTo(box.x, box.y + cornerSize);
        ctx.lineTo(box.x, box.y);
        ctx.lineTo(box.x + cornerSize, box.y);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(box.x + box.width - cornerSize, box.y);
        ctx.lineTo(box.x + box.width, box.y);
        ctx.lineTo(box.x + box.width, box.y + cornerSize);
        ctx.stroke();
        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(box.x, box.y + box.height - cornerSize);
        ctx.lineTo(box.x, box.y + box.height);
        ctx.lineTo(box.x + cornerSize, box.y + box.height);
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(box.x + box.width - cornerSize, box.y + box.height);
        ctx.lineTo(box.x + box.width, box.y + box.height);
        ctx.lineTo(box.x + box.width, box.y + box.height - cornerSize);
        ctx.stroke();

        // Tag banner above box
        const labelText = isSuppressed
          ? `[AUTO-FILTERED]: ${box.label} (${box.confidence}%)`
          : `${box.label}: ${box.confidence}%`;

        ctx.font = 'bold 11px monospace';
        const textWidth = ctx.measureText(labelText).width;
        
        ctx.fillStyle = isSuppressed 
          ? 'rgba(30, 41, 59, 0.85)' 
          : box.type === 'hostile' 
          ? 'rgba(185, 28, 28, 0.9)' 
          : 'rgba(13, 148, 136, 0.9)';
        ctx.fillRect(box.x, box.y - 20, textWidth + 12, 18);

        ctx.fillStyle = isSuppressed ? '#94a3b8' : '#ffffff';
        ctx.fillText(labelText, box.x + 6, box.y - 6);
      });

      // 3. Draw Tactical HUD Crosshair in Center
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.moveTo(cx - 45, cy);
      ctx.lineTo(cx - 15, cy);
      ctx.moveTo(cx + 15, cy);
      ctx.lineTo(cx + 45, cy);
      ctx.moveTo(cx, cy - 45);
      ctx.lineTo(cx, cy - 15);
      ctx.moveTo(cx, cy + 15);
      ctx.lineTo(cx, cy + 45);
      ctx.stroke();

      // On-screen telemetry stamp
      ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.font = '10px monospace';
      ctx.fillText(`EDGE INFERENCE: 26.3ms • YOLOv8-NANO-INT8`, 15, 25);
      ctx.fillText(`SENSOR TOWER: ${activeCamera} • FPS: ${fps}`, 15, 40);
      ctx.fillText(`ELEVATION: 4,410m • AZIMUTH: 042° NE`, 15, 55);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [visionMode, confidenceThreshold, wildlifeFilterEnabled, activeCamera, fps]);

  return (
    <div className="space-y-5">
      {/* Module Title Bar */}
      <div className="bg-[#080d17] border border-cyan-900/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40">
            <Eye className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center">
              EDGE-AI VISION & THREAT RECOGNITION (YOLOv8)
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              On-device deep learning vision stack distinguishing hostile personnel, UAVs, and high-altitude alpine wildlife.
            </p>
          </div>
        </div>

        {/* Quick KPI pills */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-black/50 px-3 py-1.5 rounded-lg border border-emerald-900/60 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-slate-400 text-[10px]">THREAT PRECISION</div>
              <div className="text-emerald-400 font-bold">94.6% (&gt;92% SPEC)</div>
            </div>
          </div>

          <div className="bg-black/50 px-3 py-1.5 rounded-lg border border-cyan-900/60 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-slate-400 text-[10px]">DETECTION LATENCY</div>
              <div className="text-cyan-400 font-bold">26.3 ms / FRAME</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Canvas & Control Rack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Video Feed Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative bg-black rounded-xl overflow-hidden border border-cyan-900/50 shadow-2xl">
            {/* Live Camera Feed Canvas */}
            <canvas
              ref={canvasRef}
              width={720}
              height={440}
              className="w-full h-auto block cursor-crosshair"
            />

            {/* CRT scanline overlay effect */}
            <div className="crt-overlay absolute inset-0"></div>

            {/* Live badge overlay */}
            <div className="absolute top-3 left-3 z-10 flex items-center space-x-2 bg-black/70 px-2.5 py-1 rounded border border-red-500/50 text-[11px] font-mono text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold">LIVE EDGE FEED: {activeCamera}</span>
            </div>

            {/* Mode Indicator Overlay */}
            <div className="absolute top-3 right-3 z-10 bg-black/70 px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
              SPECTRUM: <span className="text-cyan-400 font-bold uppercase">{visionMode}</span>
            </div>
          </div>

          {/* Camera Selection Strip */}
          <div className="flex items-center justify-between bg-[#080d17] p-2 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 flex items-center">
              <Camera className="w-3.5 h-3.5 mr-1 text-cyan-400" /> SENSOR MAST FEEDS:
            </span>
            <div className="flex space-x-2">
              {[
                { id: 'CAM-TWR-04-FLIR', label: 'Sector 4 FLIR (Chumbi Pass)' },
                { id: 'CAM-TWR-02-OPTICAL', label: 'Sector 2 Optical (Dras Ridge)' },
                { id: 'CAM-TWR-07-DUAL', label: 'Sector 7 NVG (Pangong North)' }
              ].map(cam => (
                <button
                  key={cam.id}
                  onClick={() => setActiveCamera(cam.id)}
                  className={`px-2.5 py-1 rounded transition-all ${
                    activeCamera === cam.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Vision Filter Controls & Deep Learning Metrics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Spectrum Filter Modes */}
          <div className="bg-[#080d17] border border-slate-800/80 rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-white mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2 text-cyan-400" />
              SENSOR SPECTRUM MODES
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setVisionMode('thermal')}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 transition-all ${
                  visionMode === 'thermal'
                    ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                    : 'bg-[#060a12] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4 text-purple-400" />
                <span>FLIR Thermal</span>
              </button>

              <button
                onClick={() => setVisionMode('nvg')}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 transition-all ${
                  visionMode === 'nvg'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-[#060a12] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-emerald-400" />
                <span>NVG Phosphor</span>
              </button>

              <button
                onClick={() => setVisionMode('optical')}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 transition-all ${
                  visionMode === 'optical'
                    ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                    : 'bg-[#060a12] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-blue-400" />
                <span>RGB Optical</span>
              </button>

              <button
                onClick={() => setVisionMode('wireframe')}
                className={`p-2.5 rounded-lg border flex items-center space-x-2 transition-all ${
                  visionMode === 'wireframe'
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                    : 'bg-[#060a12] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Neural Net Grid</span>
              </button>
            </div>
          </div>

          {/* Wildlife Filtering & Confidence Rack */}
          <div className="bg-[#080d17] border border-slate-800/80 rounded-xl p-4 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="font-bold text-white flex items-center">
              <Sliders className="w-4 h-4 mr-2 text-amber-400" />
              INTELLIGENT EDGE SUPPRESSION
            </h3>

            {/* Wildlife Filter Switch */}
            <div className="bg-[#060a12] p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-300 font-bold">Fauna False-Alarm Filter</span>
                <button
                  onClick={() => setWildlifeFilterEnabled(!wildlifeFilterEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    wildlifeFilterEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    wildlifeFilterEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                {wildlifeFilterEnabled 
                  ? 'Active: Automatically suppresses alarms caused by Himalayan ibex, yaks, brown bears, and birds.'
                  : 'Disabled: All motion triggers perimeter alarms (high false alarm rate).'
                }
              </p>
            </div>

            {/* Confidence Threshold Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Confidence Threshold:</span>
                <span className="text-cyan-400 font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>50% (High Recall)</span>
                <span>75% (Balanced)</span>
                <span>95% (High Precision)</span>
              </div>
            </div>

            {/* Live Model Inference Specs */}
            <div className="border-t border-slate-800 pt-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Architecture:</span>
                <span className="text-white">YOLOv8n-Custom-Border</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Edge Hardware:</span>
                <span className="text-cyan-300">NVIDIA Jetson Orin Nano</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Precision Quantization:</span>
                <span className="text-emerald-400">TensorRT INT8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">False-Alarm Suppression:</span>
                <span className="text-amber-400">96.2% Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
