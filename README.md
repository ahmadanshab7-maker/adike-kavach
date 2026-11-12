# 🌴 Adike Kavach

**Weather-informed spray-window planning for areca nut growers.**

Adike Kavach is a proof-of-concept that explores how hourly weather forecasts can help areca nut growers identify potentially suitable spray windows and keep track of spray intervals.

> **Research prototype — not an agronomic advisory.** The rules and thresholds in this demo are configurable assumptions, not scientifically validated recommendations. Weather forecasts can change, and a suggested window does not guarantee rain-free conditions. Consult CPCRI, your local Krishi Vigyan Kendra (KVK), or a qualified agricultural expert before making crop-protection decisions.

---

## Prototype preview

The screenshots below show the two modes currently available in the browser prototype.

### Live 7-day weather forecast

Displays the calculated spray-cycle status, the best candidate spray window, and an hourly rainfall timeline with feasible spray-plus-dry-down periods highlighted.

<img width="1549" height="1114" alt="image" src="https://github.com/user-attachments/assets/1f9d4b99-9424-4ae5-9835-e6a7d5b0aab3" />

### Historical weather replay — July 2024

Replays observed rainfall for 1–31 July 2024 to demonstrate how the rule engine evaluates historical conditions. This is not a forecast-accuracy test and does not establish agronomic effectiveness.
<img width="1591" height="1081" alt="image" src="https://github.com/user-attachments/assets/ab3a945e-6375-412c-8495-eac35f314017" />


---

## The problem

Areca nut growers need to consider weather conditions when planning crop-protection sprays. Rain soon after spraying may affect application outcomes, while tracking the interval between spray cycles can be difficult.

## Our approach

Adike Kavach combines two simple ideas in one browser-based demo:

- **Weather-aware planning:** evaluates hourly forecast data to identify candidate periods that meet configurable spray-duration and rain-free-buffer rules.
- **Spray-cycle tracking:** classifies the time since the previous spray as not due, plan, due, or overdue using configurable day thresholds.

The prototype is intended to demonstrate a decision-support workflow, not to diagnose disease or prescribe treatment.

## Features in this prototype

| Feature | What it does |
|---|---|
| Live weather check | Retrieves a seven-day hourly forecast from Open-Meteo |
| Spray-window engine | Checks candidate hours against configurable duration and rain-free buffer settings |
| Spray-cycle tracker | Calculates a cycle status from the days since the last spray |
| Historical replay | Replays observed weather for July 2024 |
| Neighbour-report logic | Includes core calculations for recent reports; no live reporting service is connected |
| Unit tests | Tests the core decision engine |

## Demo workflow

1. Enter the plantation latitude and longitude.
2. Enter the number of days since the last spray.
3. Set the assumed spraying duration and rain-free buffer.
4. Select **Check live 7-day forecast** or **Replay July 2024**.
5. Review the cycle status and hourly rainfall/window chart.

The default coordinates are sample values and should be changed to the intended plantation location.

## Run locally

### Requirements

- Node.js 18 or later
- Python 3 (for the local static web server)
- Internet connection for Open-Meteo weather data

### Start the demo

```bash
git clone https://github.com/ahmadanshab7-maker/adike-kavach.git
cd adike-kavach
npm test
npm start
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also open `prototype/index.html` directly, but serving it locally is recommended.

## Technology

- **HTML, CSS and JavaScript** — browser-based prototype and decision logic
- **Node.js** — runs the unit-test script
- **Python 3** — serves the static prototype locally
- **Open-Meteo API** — forecast and historical weather data

## Project status

### Implemented

- Browser-based prototype
- Configurable spray-window and cycle rules
- Open-Meteo forecast integration
- July 2024 historical weather replay
- Core engine unit tests

### Planned — not yet implemented

- Backend API, scheduler and persistent database
- Farmer accounts, garden registration and saved spray logs
- Telegram bot and Kannada notifications
- Live farmer disease-report submission, photo verification and map
- Validation of decision rules with agricultural specialists

## Important limitations

- The spray duration, rain-free buffer, wind limit, probability threshold, cycle interval and neighbour-report thresholds are configurable assumptions.
- These defaults require validation against local agronomic guidance and the original CPCRI/ICAR references before any real-world use.
- Forecasts are uncertain and may change after a recommendation is calculated.
- Missing precipitation-probability data is treated as unknown/zero in the window calculation; it must not be interpreted as a measured zero probability.
- Historical replay demonstrates how the rules behave with observed weather. It does not validate forecast accuracy or prove disease reduction.
- Always follow local agricultural guidance and the product label.

## Data and attribution

Weather data is provided through the [Open-Meteo](https://open-meteo.com/) forecast and historical archive APIs. Review Open-Meteo's current attribution and licence requirements before public or commercial deployment.

Crop-protection timing references in the project concept should be checked against the original CPCRI/ICAR publications and local expert guidance.

## Repository structure

```text
adike-kavach/
├── assets/
│   ├── screenshot-live-forecast.jpg
│   └── screenshot-historical-replay.jpg
├── backend/            # Reserved for future backend work
├── bot/                # Reserved for future bot integration
├── docs/               # Reserved for future documentation
├── prototype/
│   ├── engine.js
│   └── index.html
├── tests/
│   └── engine.test.js
├── .gitignore
├── package.json
└── README.md
```

## Team DedSec

- Ahmad Anshab
- Latheesh PG
- Safwan Ahmed

---

**Adike Kavach** · Open-innovation prototype 

