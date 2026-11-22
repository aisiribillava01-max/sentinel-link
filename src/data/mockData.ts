import { ThreatAlert, MeshNode, SoldierBiometrics, FamilyRelayMessage, SystemMetrics } from '../types';

export const initialSystemMetrics: SystemMetrics = {
  alertLatencyMs: 1420, // < 2s!
  threatPrecisionPct: 94.6, // > 92%!
  activeMeshNodes: 9,
  packetsDeliveredPct: 99.8,
  falseAlarmSuppressionPct: 96.2,
  encryptionStandard: 'AES-256-GCM + SHA-256 HMAC'
};

export const initialThreatAlerts: ThreatAlert[] = [
  {
    id: 'TR-8902',
    timestamp: '15:38:22 IST',
    type: 'hostile_incursion',
    confidence: 0.942,
    sector: 'Sector 4 - Nathu La Ridge (Chumbi Approach)',
    coordinates: {
      lat: 27.3865,
      lng: 88.8310,
      mgrs: '45R XA 8312 3014',
      elevation: 4310
    },
    cameraFeedId: 'CAM-TWR-04-FLIR',
    verified: false,
    status: 'ACTIVE_INVESTIGATION',
    details: '2 armed human profiles detected moving along blind defilade 400m south of Line of Actual Control.',
    thermalSignature: 'HIGH_HUMAN',
    aiModelVersion: 'YOLOv8-Edge-Tactical-v3.2'
  },
  {
    id: 'TR-8899',
    timestamp: '15:31:05 IST',
    type: 'wildlife_filtered',
    confidence: 0.968,
    sector: 'Sector 2 - Dras Valley Overlook',
    coordinates: {
      lat: 34.4281,
      lng: 75.7512,
      mgrs: '43S VB 7512 4281',
      elevation: 3280
    },
    cameraFeedId: 'CAM-TWR-02-OPTICAL',
    verified: true,
    status: 'DISMISSED_WILDLIFE',
    details: 'Himalayan Brown Bear / Ibex pack traverse detected on perimeter fence. Auto-suppressed without alarm dispatch.',
    thermalSignature: 'FAUNA_QUADRUPED',
    aiModelVersion: 'YOLOv8-Edge-Tactical-v3.2'
  },
  {
    id: 'TR-8894',
    timestamp: '15:19:40 IST',
    type: 'unauthorized_uav',
    confidence: 0.915,
    sector: 'Sector 7 - Pangong North Shore Finger 4',
    coordinates: {
      lat: 33.7544,
      lng: 78.6721,
      mgrs: '44R WA 6721 7544',
      elevation: 4250
    },
    cameraFeedId: 'CAM-TWR-07-DUAL',
    verified: true,
    status: 'QRF_DISPATCHED',
    details: 'Low-RCS micro-rotary UAV loitering at 80m altitude; anti-drone EW soft-kill jammer armed.',
    thermalSignature: 'UAV_THERMAL',
    aiModelVersion: 'YOLOv8-Edge-Tactical-v3.2'
  }
];

export const initialMeshNodes: MeshNode[] = [
  {
    id: 'NODE-HQ-01',
    callsign: 'COMMAND POST "SHAKTI" (HQ)',
    type: 'BASE_STATION',
    x: 18,
    y: 82,
    status: 'ONLINE',
    battery: 100,
    rssi: -42,
    snr: 14.5,
    elevation: 3120,
    connectedPeers: ['NODE-RPT-01', 'NODE-RPT-02'],
    aesKeyFingerprint: 'SHA256:7e:92:4a:d1:...:88',
    firmwareVersion: 'v2.4.1-IND-TAC',
    lastPing: '2s ago'
  },
  {
    id: 'NODE-RPT-01',
    callsign: 'MAST REPEATER 1 (RIDGE)',
    type: 'REPEATER_TOWER',
    x: 35,
    y: 58,
    status: 'ONLINE',
    battery: 94,
    rssi: -68,
    snr: 9.8,
    elevation: 4190,
    connectedPeers: ['NODE-HQ-01', 'NODE-RPT-03', 'NODE-CAM-01'],
    aesKeyFingerprint: 'SHA256:3a:11:9f:c2:...:40',
    firmwareVersion: 'v2.4.1-IND-TAC',
    lastPing: '1s ago'
  },
  {
    id: 'NODE-RPT-02',
    callsign: 'VALLEY PASS RELAY 2',
    type: 'REPEATER_TOWER',
    x: 48,
    y: 75,
    status: 'ONLINE',
    battery: 88,
    rssi: -72,
    snr: 8.2,
    elevation: 3650,
    connectedPeers: ['NODE-HQ-01', 'NODE-SOL-01', 'NODE-SOL-02'],
    aesKeyFingerprint: 'SHA256:bf:08:29:1e:...:03',
    firmwareVersion: 'v2.4.1-IND-TAC',
    lastPing: '3s ago'
  },
  {
    id: 'NODE-RPT-03',
    callsign: 'HIGH FORWARD REPEATER 3',
    type: 'REPEATER_TOWER',
    x: 68,
    y: 42,
    status: 'ONLINE',
    battery: 82,
    rssi: -79,
    snr: 7.1,
    elevation: 4850,
    connectedPeers: ['NODE-RPT-01', 'NODE-CAM-02', 'NODE-SOL-03'],
    aesKeyFingerprint: 'SHA256:12:44:aa:66:...:91',
    firmwareVersion: 'v2.4.1-IND-TAC',
    lastPing: '2s ago'
  },
  {
    id: 'NODE-CAM-01',
    callsign: 'AI SENSOR MAST "TRISHUL-4"',
    type: 'EDGE_SENSOR',
    x: 52,
    y: 28,
    status: 'ONLINE',
    battery: 91,
    rssi: -75,
    snr: 8.5,
    elevation: 4400,
    connectedPeers: ['NODE-RPT-01', 'NODE-RPT-03'],
    aesKeyFingerprint: 'SHA256:88:ef:31:02:...:aa',
    firmwareVersion: 'v2.4.1-JETSON-ORIN',
    lastPing: '1s ago'
  },
  {
    id: 'NODE-CAM-02',
    callsign: 'AI SENSOR POST "PINAKA-7"',
    type: 'EDGE_SENSOR',
    x: 82,
    y: 35,
    status: 'ONLINE',
    battery: 77,
    rssi: -84,
    snr: 6.2,
    elevation: 4620,
    connectedPeers: ['NODE-RPT-03'],
    aesKeyFingerprint: 'SHA256:c9:81:72:fa:...:5e',
    firmwareVersion: 'v2.4.1-JETSON-ORIN',
    lastPing: '4s ago'
  },
  {
    id: 'NODE-SOL-01',
    callsign: 'PATROL ALPHA LEAD (SUB. VIKRAM)',
    type: 'SOLDIER_WEARABLE',
    x: 62,
    y: 84,
    status: 'ONLINE',
    battery: 86,
    rssi: -88,
    snr: 5.4,
    elevation: 3820,
    connectedPeers: ['NODE-RPT-02', 'NODE-SOL-02'],
    aesKeyFingerprint: 'SHA256:da:42:33:bb:...:19',
    firmwareVersion: 'v1.8.0-TACTICAL-WATCH',
    lastPing: '1s ago'
  },
  {
    id: 'NODE-SOL-02',
    callsign: 'PATROL ALPHA SCOUT (NK. RAJESH)',
    type: 'SOLDIER_WEARABLE',
    x: 74,
    y: 78,
    status: 'ONLINE',
    battery: 92,
    rssi: -91,
    snr: 4.8,
    elevation: 3950,
    connectedPeers: ['NODE-SOL-01', 'NODE-RPT-02'],
    aesKeyFingerprint: 'SHA256:fe:10:87:ac:...:66',
    firmwareVersion: 'v1.8.0-TACTICAL-WATCH',
    lastPing: '2s ago'
  },
  {
    id: 'NODE-SOL-03',
    callsign: 'FORWARD OP (HAV. SANDEEP)',
    type: 'SOLDIER_WEARABLE',
    x: 88,
    y: 54,
    status: 'ONLINE',
    battery: 69,
    rssi: -95,
    snr: 3.9,
    elevation: 4790,
    connectedPeers: ['NODE-RPT-03'],
    aesKeyFingerprint: 'SHA256:01:8a:ec:55:...:dd',
    firmwareVersion: 'v1.8.0-TACTICAL-WATCH',
    lastPing: '3s ago'
  }
];

export const initialSoldierBiometrics: SoldierBiometrics = {
  soldierId: 'SL-IND-89104',
  callsign: 'VIKRAM-LEAD',
  unit: '14 Vikas (Special Frontier Force) / Forward Bravo',
  rank: 'Subedar',
  heartRate: 74,
  hrHistory: [70, 72, 71, 74, 75, 73, 76, 74, 73, 75, 74],
  spO2: 97,
  coreTemp: 36.8,
  stressIndex: 28,
  altitude: 4310,
  batteryPct: 86,
  solarCharging: true,
  isSosActive: false,
  manDownDetected: false,
  stealthMode: false,
  coordinates: {
    lat: 27.3865,
    lng: 88.8310,
    mgrs: '45R XA 8312 3014'
  }
};

export const sampleFamilyRelays: FamilyRelayMessage[] = [
  {
    id: 'RELAY-2026-901',
    soldierId: 'SL-IND-89104',
    soldierName: 'Subedar Vikram Singh Rathore',
    familyContactName: 'Anuradha Rathore',
    relation: 'Spouse',
    channel: 'SMS_AIRGAP',
    sanitizedStatus: 'ACTIVE_HEALTHY',
    displayNote: 'Subedar Vikram is in prime physical condition. Forward station welfare heartbeat verified. Safe & healthy.',
    timestamp: '22 Nov 2026, 14:00 IST',
    approvedByOfficer: 'Maj. K. S. Bakshi (Adjutant 14 Vikas)',
    airGapAudit: {
      gpsStripped: true,
      tacticalMetadataRemoved: true,
      rawRFFiltered: true,
      zeroLeakageVerified: true,
      cryptographicHash: '0x9E7F4B231ACD7802'
    }
  },
  {
    id: 'RELAY-2026-902',
    soldierId: 'SL-IND-77218',
    soldierName: 'Naik Rajesh Kumar',
    familyContactName: 'Shanti Devi',
    relation: 'Mother',
    channel: 'SECURE_FAMILY_PORTAL',
    sanitizedStatus: 'ROUTINE_STANDBY',
    displayNote: 'Naik Rajesh is on scheduled operational cycle. Vitals verified normal. Communication window scheduled for weekend.',
    timestamp: '22 Nov 2026, 11:30 IST',
    approvedByOfficer: 'Capt. A. Sengupta (Battalion Comms)',
    airGapAudit: {
      gpsStripped: true,
      tacticalMetadataRemoved: true,
      rawRFFiltered: true,
      zeroLeakageVerified: true,
      cryptographicHash: '0x5C118B89DF0331AA'
    }
  }
];
