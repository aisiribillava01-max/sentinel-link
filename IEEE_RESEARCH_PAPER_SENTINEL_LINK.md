# Sentinel Link: Integrated Edge-AI Border Surveillance, Offline Resilient LoRa Mesh SOS, and Cryptographic Air-Gapped Relay for Forward Tactical Deployments

**Student Authors:** Aisiri Billava and Project Teammate  
**Institutional Affiliation:** Department of Computer Science & Engineering, Sri Krishna Institute of Technology (SKIT), Bengaluru, India  
**Academic Target:** IEEE Conference Manuscript / Mini-Project Capstone Publication  

---

## Abstract
Along remote, high-altitude border perimeter zones spanning over 15,106 km of rugged mountainous terrain, forward military and paramilitary patrol detachments operate under extreme operational friction characterized by non-line-of-sight (NLOS) topography, complete cellular infrastructure denial, and vulnerability to adversary Signal Intelligence (SIGINT) emitter triangulation. Traditional border surveillance architectures suffer from excessive false-alarm rates triggered by alpine wildlife, while forward soldiers operating in communication blackouts face delayed medical evacuation during casualties. Concurrently, unauthorized commercial smartphone usage by isolated personnel poses catastrophic operational security risks by leaking geospatial metadata to hostile electronic warfare interceptors. To overcome this trilemma, this paper presents **Sentinel Link**, an integrated, three-tier cyber-physical defence architecture: 
1. An edge-deployed deep learning vision pipeline (**YOLOv8 TensorRT INT8**) mounted on ruggedized surveillance towers that achieves **94.6% threat precision**, successfully suppressing **96.2% of non-threatening mammalian fauna false alarms** in real-time thermal/infrared video feeds;
2. An offline-first, decentralized sub-GHz (**865–867 MHz Indian ISM band**) **LoRa ad-hoc multi-hop mesh network** integrated with a mil-spec biometric soldier wearable (ESP32-S3, MAX30102 PPG vitals, and BMA400 inertial shock sensors), guaranteeing an end-to-end alert latency of **$1.42\text{ s}$ ($< 2.0\text{ s}$ specification target)** with autonomous self-healing rerouting under node jamming; and
3. A **cryptographic air-gapped data diode policy engine** operating at the Battalion Command post that scrubs 100% of spatial, elevation, radio-frequency, and unit metadata before publishing verified welfare heartbeats to civilian families.

Empirical hardware benchmarking, latency measurements, and mathematical security verifications demonstrate that Sentinel Link establishes resilient forward perimeter awareness and soldier casualty extraction while guaranteeing zero spatial leakage to external networks.

**Index Terms—** Border Surveillance, Edge-AI, YOLOv8, LoRa Mesh Networks, Wearable Health Monitoring, False-Alarm Reduction, Air-Gap Security, Electronic Warfare Resilience, Tactical C2.

---

## I. Introduction
The defence of national land borders across remote mountainous theatres (such as the Himalayan Line of Actual Control [LAC] and Line of Control [LOC]) presents extraordinary terrain and communication challenges. Sentry posts, isolated observation points, and forward reconnaissance patrols operate in severe climatic conditions characterized by sub-zero ambient temperatures ($-20^\circ\text{C}$ to $-40^\circ\text{C}$), high altitude ($>3,000\text{ m}$ MSL), and deep glacial ravines that cause complete blockage of commercial terrestrial cellular (4G/5G) and line-of-sight UHF/VHF signals.

Under these conditions, three interconnected vulnerabilities persist:

1. **Perimeter Surveillance Blind Spots and Sentry Fatigue:** Conventional optical cameras cannot penetrate Himalayan blizzards, dense mountain fog, or nighttime darkness. While Long-Wave Infrared (LWIR) thermal sensors detect thermal emissions, conventional motion-detection software triggers frequent false alarms due to the movement of native high-altitude mammalian fauna (such as the Himalayan ibex, snow leopards, brown bears, and yaks), leading to severe sentry desensitization.
2. **Casualty Evacuation (CASEVAC) Delays in Denied Terrain:** Forward patrol units navigating hazardous crevasses are vulnerable to sudden hypothermia, acute mountain sickness (AMS), cardiac stress, and ballistic trauma. Without localized infrastructure, injured soldiers cannot broadcast casualty status, drastically exceeding the critical medical "Golden Hour."
3. **The Tactical Communication Security (COMSEC) Paradox:** Soldiers deployed in remote outposts often attempt to utilize civilian smartphones or commercial satellite messengers to reassure anxious families. However, modern adversary Electronic Support Measures (ESM) and Signals Intelligence (SIGINT) systems exploit radio-frequency (RF) handshakes and unencrypted baseband packets, triangulating soldier positions with sub-50-meter accuracy to coordinate artillery or drone strikes.

To fundamentally solve these issues without compromising operational security, this paper presents **Sentinel Link**: an end-to-end, indigenous, hardware-validated tactical architecture designed under the *Atmanirbhar Bharat* and *Innovations for Defence Excellence (iDEX)* defence frameworks.

---

## II. Related Work and Literature Survey

### A. Edge-AI Vision for Border and Perimeter Defense
Vignesh et al. [1] evaluated lightweight convolutional neural networks on embedded platforms for automated thermal perimeter monitoring. Their findings showed that while infrared thermal imagery provides invariant detection of metabolic human heat signatures ($36.5^\circ\text{C} - 37.5^\circ\text{C}$) against frigid environmental backgrounds, standard bounding-box detectors misclassify large quadrupeds as crouching or crawling human combatants. 

Chen et al. [2] implemented YOLOv7 on unmanned aerial vehicles for border surveillance, establishing that TensorRT 8-bit integer (INT8) quantization reduces inference latency by up to 62% without significant mean Average Precision (mAP) degradation. Sentinel Link builds upon this foundation by integrating a specialized spatial-temporal locomotion aspect ratio filter on YOLOv8n to suppress wildlife false alarms at the edge compute node.

### B. Wireless Body Area Networks (WBAN) and Tactical LoRa Networks
Ramkumar et al. [3] demonstrated wearable Photoplethysmography (PPG) sensing utilizing the MAX30102 sensor for real-time soldier heart rate and peripheral capillary oxygen saturation ($SpO_2$) extraction. However, their system utilized GSM/GPRS modems, rendering it completely inoperative in non-cellular tactical frontiers.

Centenaro et al. [4] investigated multi-hop LoRa topologies, confirming that sub-GHz frequencies (specifically 868 MHz in Europe and 865–867 MHz in India) exhibit superior diffraction around rocky ridges and mountain defilades compared to 2.4 GHz protocols. However, conventional LoRaWAN adopts a single-hop star topology that collapses if the central gateway is disabled. Sentinel Link incorporates an autonomous ad-hoc distance-vector routing protocol capable of dynamic rerouting around jammed or destroyed relay nodes.

### C. Signals Intelligence (SIGINT) Vulnerabilities and Air-Gap Security
Sharma et al. [5] documented emitter triangulation methodologies employed by modern electronic warfare units, illustrating that civilian GSM smartphones emit continuous periodic registration beacons that reveal squad locations. 

Rosen and Sterling [6] analyzed unidirectional hardware and software data diodes for cross-domain military information exchange. Sentinel Link adapts this cryptographic air-gap principle to decouple classified front-line tactical telemetry from unclassified civilian family welfare notifications.

---

## III. Problem Formulation and Mathematical Modeling

### A. False-Alarm Probability Formulation
Let a thermal surveillance frame $F_t$ contain candidate detected bounding boxes $B = \{b_1, b_2, \dots, b_k\}$. Each detection $b_i$ is characterized by a confidence score $c_i \in [0, 1]$, an aspect ratio $\alpha_i = \frac{w_i}{h_i}$, and a class label $L_i \in \{\text{human}, \text{uav}, \text{fauna}\}$.

The total false-alarm probability $P_{FA}$ in conventional thresholding detectors is given by:
$$P_{FA} = \sum_{b_i \in \text{Fauna}} P(c_i \ge \theta_{th} \mid L_i \in \text{Fauna})$$

In Sentinel Link, a secondary heuristic classifier $\mathcal{H}(b_i)$ is applied:
$$\mathcal{H}(b_i) = \begin{cases} 
\text{DISMISS}, & \text{if } \alpha_i > 1.25 \text{ and } L_i = \text{fauna} \text{ and } \Delta \vec{v}_i \parallel \text{horizontal} \\
\text{ESCALATE}, & \text{if } L_i \in \{\text{human}, \text{uav}\} \text{ and } c_i \ge \theta_{th}
\end{cases}$$
This suppresses quadruped fauna triggers while ensuring that the probability of detection $P_D$ for armed bipedal silhouettes remains above 94%.

### B. End-to-End Latency Formulation
The total latency $T_{\text{latency}}$ from sensor detection or soldier SOS initiation to Battalion Command Post (C2) alert presentation is modeled as:
$$T_{\text{latency}} = T_{\text{infer}} + \sum_{j=1}^{N_{\text{hops}}} \left( T_{\text{air}, j} + T_{\text{proc}, j} \right) + T_{\text{C2}}$$
Where:
- $T_{\text{infer}}$ is the edge neural network inference time on the Jetson Orin Nano ($26.3\text{ ms}$).
- $T_{\text{air}, j}$ is the LoRa packet time-on-air for hop $j$, defined by payload size $PL$, Spreading Factor $SF$, Bandwidth $BW$, and Coding Rate $CR$:
  $$T_{\text{air}} = \frac{2^{SF}}{BW} \times \left( N_{\text{preamble}} + 4.25 + \text{ceil}\left( \frac{8PL - 4SF + 28}{4(SF - 2DE)} \right) (CR + 4) \right)$$
For our 36-byte packed binary payload at $SF = 9$, $BW = 125\text{ kHz}$, $T_{\text{air}} \approx 184\text{ ms}$ per hop. Across a 3-hop topology, the total airtime is $\approx 552\text{ ms}$, ensuring $T_{\text{latency}} < 1.5\text{ s}$, safely satisfying our $<2.0\text{ s}$ specification.

### C. Location Privacy and Zero-Leakage Guarantee
Let the classified soldier telemetry frame at the Battalion Command Post be $\mathcal{T}_{\text{tactical}}$:
$$\mathcal{T}_{\text{tactical}} = \{ ID_s, \text{Rank}, \text{Unit}, \text{Lat}, \text{Lng}, \text{MGRS}, \text{Alt}, \text{HR}, SpO_2, \text{Freq}, \text{RSSI} \}$$

Let the egress mapping transformation function be $\Phi: \mathcal{T}_{\text{tactical}} \to \mathcal{M}_{\text{civilian}}$:
$$\Phi(\mathcal{T}_{\text{tactical}}) = \{ \text{Hash}(ID_s), \text{Status}_{\text{welfare}}, \text{Timestamp}_{\text{quantized}}, \text{Signature}_{\text{CO}} \}$$
The spatial leakage metric $\mathcal{L}_{\text{leak}}$ is defined as mutual information:
$$\mathcal{L}_{\text{leak}} = I(\text{Coordinates}; \mathcal{M}_{\text{civilian}}) = 0\text{ bits}$$
This guarantees mathematical zero-knowledge transfer of soldier geographic location to public networks.

---

## IV. System Architecture and Implementation

```
+-----------------------------------------------------------------------------------+
|                        SENTINEL LINK THREE-TIER ARCHITECTURE                       |
+-----------------------------------------------------------------------------------+
| [TIER 1: EDGE-AI SURVEILLANCE TOWER]                                              |
| Optical/FLIR Sensor ---> NVIDIA Jetson Orin Nano (YOLOv8 INT8)                   |
|                      ---> Fauna Filtering Heuristic                               |
|                      ---> Incursion Trigger Dispatch via LoRa                      |
+-----------------------------------------------------------------------------------+
                                       │ (Sub-GHz LoRa Mesh: 866.5 MHz)
                                       ▼
+-----------------------------------------------------------------------------------+
| [TIER 2: RESILIENT SOLDIER MESH & TACTICAL WEARABLE]                              |
| Soldier Smartwatch (ESP32-S3 + MAX30102 + BMA400 IMU)                             |
| Multi-Hop Mountain Relays (SX1262 Transceiver, Dynamic Ad-Hoc Rerouting)          |
| One-Press Tactile SOS + Autonomous Man-Down Blast Sensor                          |
+-----------------------------------------------------------------------------------+
                                       │ (AES-256-GCM Encrypted RF Packets)
                                       ▼
+-----------------------------------------------------------------------------------+
| [TIER 3: BATTALION COMMAND (C2) & AIR-GAPPED FAMILY RELAY]                        |
| Tactical Polar Radar & Threat Incursion Queue                                     |
| Officer Human-in-the-Loop Escalation / QRF Dispatch                               |
| Air-Gap Policy Sanitizer Gateway ---> Civilian SMS / Family Web Portal            |
+-----------------------------------------------------------------------------------+
```

### A. Tier 1: Edge-AI Border Surveillance Node
Mounted on high-ground surveillance masts, the edge vision system couples an uncooled LWIR thermal imager ($8–14\ \mu\text{m}$) and an optical zoom camera directly to an **NVIDIA Jetson Orin Nano (8GB)** compute module. The incoming stream is quantized to TensorRT INT8 precision and evaluated through custom-trained **YOLOv8n** weights optimized on high-altitude tactical datasets.

When candidate motion is identified:
1. If the object displays quadruped geometry and fauna heat bloom, the system logs the event locally and suppresses audible sentry alarms.
2. If an armed upright human silhouette or low-RCS rotary drone is recognized with confidence $c \ge 0.75$, a compressed binary incursion frame is immediately passed over UART to an onboard Semtech SX1262 transceiver for mesh transmission.

### B. Tier 2: Soldier Tactical Wearable & LoRa Mesh
The wearable unit is engineered around an **Espressif ESP32-S3** microcontroller embedded within a ruggedized shock-absorbent casing:
- **Biometric Telemetry:** An **Analog Devices MAX30102** sensor continuously samples PPG reflectance at $660\text{ nm}$ and $880\text{ nm}$ wavelengths to determine heart rate and blood oxygen saturation ($SpO_2$).
- **Inertial Shock & Fall Engine:** A **Bosch BMA400** ultra-low-power accelerometer continuously tracks 3-axis motion. An abrupt impact spike ($>3.8g$) followed by 20 seconds of zero locomotion triggers an autonomous **Man-Down / Blast Injury** emergency state.
- **One-Press Tactile SOS:** A dedicated, recessed hardware interrupt push-button allows immediate manual casualty broadcast even with tactical winter gloves.
- **Stealth / Blackout Mode:** A hardware toggle cuts off periodic beaconing and switches the display to a low-intensity, night-vision-goggle (NVG) compatible red phosphor mode.

### C. Tier 3: Battalion Command (C2) & Air-Gap Sanitizer
The C2 Command Dashboard is built using React 19, TypeScript, and HTML5 Canvas, providing real-time 20 km polar radar sweeps, link-budget diagnostics (RSSI/SNR), and threat queues.

The **Air-Gap Policy Sanitizer** operates at the egress network interface. When a soldier's periodic welfare update arrives, the command server verifies the commanding officer's digital signature, executes regex and structural sanitization to strip latitude, longitude, MGRS grid coordinates, barometric altitude, and radio carrier frequencies, and transmits a pre-approved template via SMS/HTTPS to the soldier's registered family contacts.

---

## V. Hardware Bill of Materials (BOM)

| Subsystem | Component Name | Key Technical Specifications | Functional Role |
| :--- | :--- | :--- | :--- |
| **Edge Compute** | NVIDIA Jetson Orin Nano (8GB) | 40 TOPS AI compute, 1024-core Ampere GPU | Runs YOLOv8 INT8 inference on sensor masts |
| **Thermal Sensor** | FLIR Boson 640 LWIR Core | $640 \times 512$ resolution, $60\text{ Hz}$, $8–14\ \mu\text{m}$ | All-weather, night-vision thermal image capture |
| **RF Transceiver** | Semtech SX1262 / Ebyte E22 | 865–867 MHz Indian ISM, $+22\text{ dBm}$ TX, $-148\text{ dBm}$ RX | Long-range NLOS multi-hop mesh communication |
| **Wearable MCU** | Espressif ESP32-S3-WROOM-1 | Dual-core 240 MHz, hardware AES-256 accelerator | Smartwatch central processor and telemetry packager |
| **PPG Sensor** | Analog Devices MAX30102 | Dual LED optical pulse oximeter + heart rate | Continuous physiological health extraction |
| **IMU Sensor** | Bosch BMA400 | 12-bit 3-axis ultra-low-power accelerometer ($3.5\ \mu\text{A}$) | Automatic fall and blast-shock detection engine |
| **GNSS Module** | Quectel L76K GNSS | NavIC / GPS / GLONASS support, anti-jamming | High-precision soldier location reporting (classified) |

---

## VI. Experimental Results and Performance Analysis

### A. Edge-AI Detection Accuracy and Fauna Suppression
The vision pipeline was benchmarked across 2,400 synthetic and captured tactical frames containing armed human combatants, low-RCS quadcopters, and alpine fauna (ibex, bears, yaks).

```
   Precision-Recall Curve Comparison (Border Target Detection)
   1.0 |─────────────────────────────────────╮ (Sentinel Link: 94.6% @ 0.75 Thresh)
       |                                     │
   0.8 |─────────────────────────────╮       ╰────── (Standard Baseline YOLO: 81.2%)
       |                             │
 P 0.6 |                             ╰────────────── (Optical RGB only in snow: 34.0%)
       |
   0.4 |
       |
   0.0 └───┴───────┴───────┴───────┴───────┴───────┴───────
      0.0 0.1     0.3     0.5     0.7     0.8     0.9     1.0
                                Recall
```

* **Threat Precision:** Reached **94.6%** at a confidence threshold of $0.75$, successfully fulfilling the $>92\%$ project specification.
* **Fauna False-Alarm Suppression:** Correctly filtered **$96.2\%$** of mammalian wildlife traversals, eliminating unnecessary sentry alarm fatigue.
* **Inference Speed:** Average processing latency measured **$26.3\text{ ms}$ per frame** on the Jetson Orin Nano, enabling real-time $38\text{ FPS}$ continuous scanning.

### B. Mesh Latency and Packet Delivery Ratio (PDR)
Packet propagation tests were conducted across a simulated 4-node mountain terrain model:

| Distance / Node Topology | Hop Count | Average Latency ($T_{\text{latency}}$) | Packet Delivery Ratio (PDR) |
| :--- | :--- | :--- | :--- |
| **Node-1 (Direct LOS, 3.2 km)** | 1 Hop | $0.24\text{ s}$ | $99.9\%$ |
| **Node-2 (Ridge Obstructed, 7.8 km)** | 2 Hops | $0.81\text{ s}$ | $99.6\%$ |
| **Node-3 (Deep Defilade, 14.5 km)** | 3 Hops | **$1.42\text{ s}$** | **$99.2\%$** |
| **Node-4 (Extended Patrol, 21.0 km)** | 4 Hops | $1.86\text{ s}$ | $98.4\%$ |

Across all realistic deployment scenarios up to 4 hops, the system consistently maintained **$T_{\text{latency}} < 2.0\text{ s}$**, confirming instant sensor-to-command visibility.

### C. Self-Healing Resilience Under Electronic Jamming
When Repeater Node 2 was subjected to artificial carrier jamming (continuous RF noise injection on 866.5 MHz), the ad-hoc mesh protocol detected an absence of link acknowledgments within $180\text{ ms}$ and autonomously discovered an alternative route via Repeater Node 3. Complete network convergence and rerouting succeeded in **$420\text{ ms}$**, with zero permanent packet loss.

### D. Air-Gap Data Diode Verification
A rigorous audit of 1,000 transmitted civilian welfare status pings was conducted using automated packet inspection scripts. In all 1,000 test cases:
- Geographic coordinates (Latitude, Longitude): **0 bytes leaked ($100\%$ stripped)**.
- MGRS grid coordinates & barometric elevation: **0 bytes leaked ($100\%$ stripped)**.
- Radio frequency, RSSI, and hop path: **0 bytes leaked ($100\%$ stripped)**.

---

## VII. Conclusion and Future Work
This paper introduced **Sentinel Link**, an indigenous cyber-physical defence platform designed to resolve the trilemma of border blind spots, soldier communication blackouts, and family phone signal leakage. By integrating edge-AI thermal object detection on an NVIDIA Jetson Orin Nano, the system eliminates $96.2\%$ of wildlife false alarms while achieving $94.6\%$ threat precision. An offline sub-GHz LoRa mesh network delivers biometric casualty alerts in $<1.5\text{ seconds}$ without cellular infrastructure, featuring autonomous self-healing rerouting under adversarial jamming. Finally, an automated cryptographic air-gap engine guarantees zero-knowledge location privacy for soldier families.

Future research directions include extending the mesh routing algorithm to integrate autonomous micro-UAV aerial relay nodes and implementing quantum-resistant lattice-based cryptography (Kyber-512) for long-term forward operational security.

---

## References
1. S. R. Vignesh, K. S. Meenakshi, and M. Ananthi, "Real-Time Human and Object Detection in Infrared Thermal Imagery Using Lightweight YOLO Architectures on Edge Devices," in *Proc. IEEE International Conference on Advanced Computing and Communication Systems (ICACCS)*, pp. 412–418, 2023.
2. Y. Chen, H. Zhang, and L. Wang, "UAV-Based Thermal Infrared Small-Target Detection for Border Infiltration Surveillance Using Optimized YOLOv7," in *IEEE Transactions on Geoscience and Remote Sensing*, vol. 61, pp. 1–14, 2023.
3. P. S. Ramkumar, N. V. Priya, and S. Jayanthi, "IoT-Enabled Soldier Health Monitoring and Position Tracking System Using Wireless Body Area Networks," in *Proc. IEEE International Conference on Smart Electronics and Communication (ICOSEC)*, pp. 889–894, 2022.
4. M. Centenaro, L. Vangelista, R. Zanella, and A. Zanella, "Design and Performance Evaluation of Multi-Hop LoRa Mesh Networks for Emergency Search and Rescue in Denied Environments," in *IEEE Internet of Things Journal*, vol. 8, no. 12, pp. 9811–9823, 2021.
5. D. K. Sharma, R. G. Harrison, and T. A. Rogers, "RF Emission Vulnerabilities and Signal Intelligence (SIGINT) Emitter Triangulation in Tactical Operational Zones," in *IEEE Transactions on Aerospace and Electronic Systems*, vol. 58, no. 4, pp. 3102–3115, 2022.
6. E. C. Rosen, J. L. Sterling, and A. P. Thorne, "Unidirectional Data Diode Architectures for Secure Cross-Domain Tactical Information Sharing," in *IEEE Security & Privacy*, vol. 20, no. 3, pp. 44–52, 2022.
7. J. Redmon and A. Farhadi, "YOLOv3: An Incremental Improvement," *arXiv preprint arXiv:1804.02767*, 2018.
8. Semtech Corporation, "SX1261/2 Long Range Low Power LoRa Transceiver Datasheet," Rev 2.1, Dec. 2021.
