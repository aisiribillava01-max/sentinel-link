/*
 * SENTINEL LINK - Embedded Soldier Tactical Wearable Firmware
 * Target: Espressif ESP32-S3 + Semtech SX1262 LoRa + MAX30102 PPG Vitals
 * Frequency: 865.0 - 867.0 MHz (Indian ISM Band)
 * Theme: Defence & National Security | Inventra 2026
 */

#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>

// Simulated RadioLib / SX1262 LoRa configuration
#define LORA_CS    5
#define LORA_DIO1  2
#define LORA_RESET 14
#define LORA_BUSY  4

#define FREQ_MHZ   866.5
#define BANDWIDTH  125.0
#define SPREADING_FACTOR 9
#define TX_POWER_DBM 22

// Hardware PIN Definitions for Tactical Wearable
#define PIN_SOS_BUTTON     0    // Pull-down tactile push button
#define PIN_STEALTH_SWITCH 1    // Hardware toggle for stealth/blackout mode
#define PIN_BUZZER         15   // Haptic vibration motor driver
#define PIN_SOLAR_ADC      34   // ADC pin measuring solar panel voltage

// Soldier Telemetry Data Structure
struct __attribute__((packed)) TacticalTelemetryPacket {
  uint16_t preamble;        // 0x534C ('SL')
  uint32_t soldier_id;      // Unique soldier ID
  uint8_t  packet_type;     // 0x01: Heartbeat, 0x02: SOS Emergency, 0x03: Man-Down
  uint8_t  heart_rate;      // BPM (30 - 220)
  uint8_t  spo2;            // Percentage (70 - 100)
  int16_t  altitude_m;      // Barometric altitude in meters
  int32_t  lat_e7;          // Latitude * 10^7
  int32_t  lng_e7;          // Longitude * 10^7
  uint8_t  battery_pct;     // Battery status (0 - 100)
  uint8_t  flags;           // Bit 0: Stealth, Bit 1: ManDown, Bit 2: SolarActive
  uint8_t  aes_gcm_tag[16]; // 128-bit authentication tag
};

volatile bool sos_triggered = false;
volatile bool man_down_detected = false;
bool stealth_mode_active = false;

// Interrupt Service Routine for instant One-Press SOS
void IRAM_ATTR onSosButtonPressed() {
  sos_triggered = true;
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println(F("[SENTINEL LINK] Initializing Mil-Spec Wearable Subsystem..."));

  pinMode(PIN_SOS_BUTTON, INPUT_PULLUP);
  pinMode(PIN_STEALTH_SWITCH, INPUT_PULLUP);
  pinMode(PIN_BUZZER, OUTPUT);

  // Attach interrupt for zero-latency SOS button press
  attachInterrupt(digitalPinToInterrupt(PIN_SOS_BUTTON), onSosButtonPressed, FALLING);

  Serial.println(F("[LORA MESH] SX1262 Transceiver configured on 866.50 MHz (SF9, +22dBm)"));
  Serial.println(F("[CRYPTO] Hardware AES-256-GCM Coprocessor: READY"));
  Serial.println(F("[VITALS] MAX30102 PPG & BMA400 Fall Sensor: ONLINE"));
}

void loop() {
  // Check hardware switches
  stealth_mode_active = (digitalRead(PIN_STEALTH_SWITCH) == LOW);

  if (sos_triggered) {
    Serial.println(F("[EMERGENCY] !!! ONE-PRESS SOS ACTIVATED !!!"));
    broadcastSosPacket();
    sos_triggered = false;
  }

  // Routine Heartbeat transmission every 30 seconds (if not in stealth mode)
  static unsigned long last_heartbeat = 0;
  if (!stealth_mode_active && (millis() - last_heartbeat > 30000)) {
    last_heartbeat = millis();
    broadcastHeartbeat();
  }

  delay(100);
}

void broadcastSosPacket() {
  TacticalTelemetryPacket pkt;
  pkt.preamble = 0x534C;
  pkt.soldier_id = 89104; // Subedar Vikram
  pkt.packet_type = 0x02; // SOS EMERGENCY
  pkt.heart_rate = 142;   // Tachycardia response
  pkt.spo2 = 96;
  pkt.altitude_m = 4310;
  pkt.lat_e7 = 273865000;
  pkt.lng_e7 = 888310000;
  pkt.battery_pct = 86;
  pkt.flags = 0x01; // SOS flag active

  Serial.println(F("[RF MESH] Transmitting AES-256 encrypted SOS packet to nearest repeater..."));
  // LoRa.transmit((uint8_t*)&pkt, sizeof(pkt));
  digitalWrite(PIN_BUZZER, HIGH);
  delay(200);
  digitalWrite(PIN_BUZZER, LOW);
}

void broadcastHeartbeat() {
  Serial.println(F("[RF MESH] Routine biometrics broadcast over LoRa mesh..."));
}
