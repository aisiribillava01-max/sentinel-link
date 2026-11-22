export type ThreatType = 
  | 'hostile_incursion' 
  | 'unauthorized_uav' 
  | 'wildlife_filtered' 
  | 'soldier_sos' 
  | 'patrol_friendly';

export interface ThreatAlert {
  id: string;
  timestamp: string;
  type: ThreatType;
  confidence: number;
  sector: string;
  coordinates: {
    lat: number;
    lng: number;
    mgrs: string;
    elevation: number;
  };
  cameraFeedId: string;
  verified: boolean;
  status: 'ACTIVE_INVESTIGATION' | 'VERIFIED_THREAT' | 'DISMISSED_WILDLIFE' | 'QRF_DISPATCHED';
  details: string;
  thermalSignature: 'HIGH_HUMAN' | 'UAV_THERMAL' | 'FAUNA_QUADRUPED' | 'ENVIRONMENTAL';
  aiModelVersion: string;
}

export type NodeType = 'BASE_STATION' | 'REPEATER_TOWER' | 'EDGE_SENSOR' | 'PATROL_TEAM' | 'SOLDIER_WEARABLE';
export type NodeStatus = 'ONLINE' | 'OFFLINE' | 'JAMMED' | 'TRANSMITTING';

export interface MeshNode {
  id: string;
  callsign: string;
  type: NodeType;
  x: number; // 0 - 100 on map
  y: number; // 0 - 100 on map
  status: NodeStatus;
  battery: number;
  rssi: number; // dBm
  snr: number; // dB
  elevation: number; // meters
  connectedPeers: string[];
  aesKeyFingerprint: string;
  firmwareVersion: string;
  lastPing: string;
}

export interface MeshPacket {
  id: string;
  sourceId: string;
  destinationId: string;
  route: string[];
  currentHopIndex: number;
  payloadType: 'SOS_EMERGENCY' | 'BIOMETRIC_TELEMETRY' | 'EDGE_DETECTION' | 'STATUS_BEACON';
  encryptedPayload: string;
  decryptedData: Record<string, any>;
  latencyMs: number;
  timestamp: string;
  ttl: number;
}

export interface SoldierBiometrics {
  soldierId: string;
  callsign: string;
  unit: string;
  rank: string;
  heartRate: number;
  hrHistory: number[];
  spO2: number;
  coreTemp: number;
  stressIndex: number; // 1-100
  altitude: number; // meters
  batteryPct: number;
  solarCharging: boolean;
  isSosActive: boolean;
  manDownDetected: boolean;
  stealthMode: boolean; // Blackout RF/Display
  coordinates: {
    lat: number;
    lng: number;
    mgrs: string;
  };
}

export interface FamilyRelayMessage {
  id: string;
  soldierId: string;
  soldierName: string;
  familyContactName: string;
  relation: string;
  channel: 'SMS_AIRGAP' | 'SECURE_FAMILY_PORTAL';
  sanitizedStatus: 'ACTIVE_HEALTHY' | 'ROUTINE_STANDBY' | 'EXERCISING_COMMS_SILENCE';
  displayNote: string;
  timestamp: string;
  approvedByOfficer: string;
  airGapAudit: {
    gpsStripped: boolean;
    tacticalMetadataRemoved: boolean;
    rawRFFiltered: boolean;
    zeroLeakageVerified: boolean;
    cryptographicHash: string;
  };
}

export interface SystemMetrics {
  alertLatencyMs: number;
  threatPrecisionPct: number;
  activeMeshNodes: number;
  packetsDeliveredPct: number;
  falseAlarmSuppressionPct: number;
  encryptionStandard: string;
}
