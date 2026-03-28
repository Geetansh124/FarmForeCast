# Farm Forecaste - Product Requirements Document (MVP)

> **Vision**: A voice-first farm advisory platform that converts weather and crop data into actionable decisions for farmers, delivered directly via simple web and voice interaction.
> 
> *Not just another weather dashboard. We are building an action engine that tells farmers exactly what to do next.*

---

## 1. Product Objective

Deliver a fully functional MVP decision-delivery system where:
1. A farmer is registered in the system.
2. Local weather data is fetched.
3. Current crop growth stage is calculated accurately.
4. Specific, actionable advisory is generated based on combined data.
5. The user can click a **"Call Me"** button to hear the advice spoken aloud (Voice-First interaction).

*Failure Condition: If the system displays mostly raw data instead of clear decisions, the product fails its core objective.*

---

## 2. System Architecture

The MVP will utilize a streamlined client-server model:

- **Frontend**: React (or Next.js) for a brutalist, wildly simple, and intuitive UI.
- **Backend**: FastAPI (Python) for rapid, high-performance logic execution.
- **Core Modules**:
  - Weather Service (API Integration)
  - Advisory Engine (Rule-based decision matrix)
  - Crop Stage Engine (Timeline-based calculator)
  - Voice Generator (TTS pipeline)
  - Mock Insurance Trigger (Simulated threshold logic)

---

## 3. Core Modules & Backend Logic

### 3.1 Weather Service
- **Provider**: OpenWeatherMap API
- **Data Fetched**: Temperature, Rainfall, Humidity

### 3.2 Crop Stage Engine
A deterministic timeline engine. No physical sensors required.

```python
# Simplified Logic Example
days_since_sowing = today - sowing_date

if days_since_sowing < 20:
    stage = "sowing"
elif days_since_sowing < 50:
    stage = "vegetative"
elif days_since_sowing < 80:
    stage = "flowering"
else:
    stage = "harvest"
```

### 3.3 Advisory Engine (Core Product Value)
A rule-based matrix taking Weather and Crop Stage as inputs to yield specific agricultural actions.

```python
# Example Ruleset Matrix
if rainfall > 70 and stage == "harvest":
    advice = "Delay harvesting immediately. High risk of crop damage."
elif humidity > 80 and 20 <= temp <= 30:
    advice = "High risk of fungal infection. Preventative spray recommended."
elif rainfall > 50 and stage == "sowing":
    advice = "Moisture levels are optimal for sowing. Proceed as planned."
```

### 3.4 Pest Prediction Engine
Rule-based logic assessing environmental conditions.

```python
if humidity > 80 and temp > 25:
    pest_alert = "Fungal Disease Risk Detected"
```

### 3.5 Voice Output System (TTS)
- **Tech Stack**: Browser-native Web Speech API OR `gTTS` (Google Text-to-Speech)
- **Flow**: Text generation -> Conversion to Hindi/Local Audio -> Playback on "Call Me" trigger.

### 3.6 Insurance Trigger
A simulated integration logic showcasing how parametric insurance would activate.

```python
if rainfall > 100:
    insurance_status = "Triggered"
    alert = "⚠️ Insurance Claim Initiated (Simulated)"
```

---

## 4. Frontend & User Experience (UX)

### 4.1 Home Screen (Farmer View)
A ruthlessly simplified interface. The design should feel premium, responsive, and distraction-free.

**Must include exactly four primary elements:**
1. Current Weather (Card)
2. Crop Stage Information (Card)
3. Risk / Pest Alerts (Card)
4. **Primary CTA**: A massive, dominant **[ 🔴 CALL ME ]** button.

*UX Note: If the "Call Me" button is not the focal point of the viewport, the UX is incorrect.*

### 4.2 Dashboard (Admin/System View)
A sleek, glassmorphic UI meant to monitor the platform.
Include the following visual cards:
- Aggregated Weather patterns
- Generated Advisories log
- Historical / Active Pest Risks
- Insurance Parametric states

---

## 5. End-to-End User Flows

### Flow A: Administrator / Onboarding
1. Admin registers a new farmer profile.
2. Admin inputs primary crop parameters (e.g., Crop Type, Sowing Date).
3. System fetches baseline weather for the registered location.
4. Initial baseline advisory is generated.

### Flow B: Farmer (Daily Interaction)
1. Farmer opens the web application.
2. Farmer taps the single **🔴 CALL ME** button.
3. System reads out the day's specific, actionable advice.

---

## 6. Database Schema (Relational/Document)

### Table: Farmers
- `id` (UUID)
- `name` (String)
- `phone` (String, unique)
- `crop_type` (String)
- `sowing_date` (Date)
- `location_coords` (String/GeoJSON)

### Table: Advisory_Logs
- `id` (UUID)
- `farmer_id` (UUID, Foreign Key)
- `weather_data` (JSON snapshot)
- `advice_text` (String)
- `risk_flag` (Boolean/String)
- `timestamp` (DateTime)

---

## 7. Demo Day Scenarios (Execution Path)

The MVP must flawlessly execute the following deterministic test cases during presentation:

- **Scenario 1 (Actionable Caution)**: 
  - *Trigger*: Heavy rain injected into weather data.
  - *Output*: “Delay harvest” text generated -> Voice Engine reads warning.
- **Scenario 2 (Pest Alert)**: 
  - *Trigger*: High humidity injected.
  - *Output*: Pest alert card illuminates red, recommends spraying.
- **Scenario 3 (Parametric Insurance)**: 
  - *Trigger*: Extreme rain threshold breached (>100mm).
  - *Output*: "Insurance Triggered" overlay activates automatically.

---

## 8. Execution Plan & Next Steps

We are transitioning from ideation to immediate build. Please approve how you would like to proceed:

- **Option A**: Proceed with Full Backend execution (Scaffold the FastAPI server, endpoints, and mock data logic).
- **Option B**: Proceed with Frontend React execution (Scaffold the Next.js/React app with Tailwind/CSS and the core "Call Me" interaction).
- **Option C**: Create the full monorepo project structure and build out step-by-step together.
