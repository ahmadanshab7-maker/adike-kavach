# Adike Kavach

**A proof-of-concept spray-window planner for areca nut growers.** Adike Kavach explores whether plantation-level hourly weather data can help a grower identify a potentially suitable window for a recommended Bordeaux-mixture spray and keep track of the spray interval.

> **Research prototype only.** This project is not an agronomic advisory, disease diagnostic tool, or guarantee of rain-free conditions. Its spray duration, rain-free buffer, wind threshold, probability threshold, and neighbour-report thresholds are configurable assumptions that require validation with CPCRI, a Krishi Vigyan Kendra (KVK), or a qualified local agricultural expert before real-world use.

## What is implemented

- **Hourly spray-window engine** (`prototype/engine.js`): checks forecast hours for a configurable spray period and rain-free buffer.
- **Spray-cycle tracker**: labels the cycle as not due, plan, due, or overdue using configurable day thresholds.
- **Neighbour-report calculations**: counts recent reports within a configurable radius and can raise the urgency level. This is core logic only; there is no live reporting service in this prototype.
- **Browser demo** (`prototype/index.html`): fetches a seven-day forecast and can replay observed July 2024 weather through Open-Meteo.
- **Unit tests** (`tests/engine.test.js`): 11 tests for the core engine.

## Not implemented yet

The following are proposed for a future build and are **not** part of the current working prototype:

- Telegram bot and Kannada notifications
- User accounts, garden registration, and persistent spray logs
- Backend API, scheduler, and SQLite database
- Live farmer disease-report submission, photo verification, and map
- Agronomist/CPCRI/KVK validation of the decision rules

## Run locally

Requirements: Node.js 18+ and Python 3 (for the simple local web server). The demo uses Open-Meteo and therefore needs an internet connection.

```bash
npm test
npm start
```

Then open http://localhost:8000. Alternatively, open `prototype/index.html` directly in a browser; serving it locally is recommended.

## How to use the demo

1. Enter the plantation latitude and longitude.
2. Enter the number of days since the last spray.
3. Adjust the assumed spray duration and rain-free buffer if needed.
4. Select **Check live 7-day forecast** or **Replay July 2024**.
5. Review the calculated cycle status and hourly rain/window chart.

The live forecast uses Open-Meteo's forecast API. The replay uses Open-Meteo's historical archive API for 1–31 July 2024. Historical replay demonstrates how the rule engine behaves with observed weather; it does not validate forecast accuracy or prove disease reduction.

## Configuration and limitations

Defaults are defined in `prototype/engine.js` under `DEFAULTS`. They are deliberately exposed as configurable values rather than presented as scientifically validated thresholds. The prototype treats missing rain-probability data as unknown/zero for the window calculation; this is appropriate for the historical replay display but should not be interpreted as a measured zero probability.

Weather forecasts are uncertain and may change. A suggested window is only a calculation from the returned forecast, not a promise that rain will not occur. Always follow current local agricultural guidance and the product label.

## Data and attribution

- Weather data: [Open-Meteo](https://open-meteo.com/) forecast and historical archive APIs. Review Open-Meteo's current attribution and licence requirements before public or commercial deployment.
- Crop-protection timing references mentioned in the hackathon concept should be checked against the original CPCRI/ICAR publications and local expert guidance before being treated as recommendations.

## Repository structure

```text
adike-kavach/
├── prototype/
│   ├── engine.js
│   └── index.html
├── tests/
│   └── engine.test.js
├── backend/            # Reserved for future implementation
├── bot/                # Reserved for future implementation
├── docs/               # Reserved for future implementation
├── package.json
└── README.md
```

## Team

**Team:** DedSec  
**Project:** Adike Kavach

Add the final team-member names and public repository URL before submitting the hackathon deck.
