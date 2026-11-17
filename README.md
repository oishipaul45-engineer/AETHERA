
cd C:\Users\Oishi\Desktop\AETHERA

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force ".github\assets" | Out-Null

if (Test-Path README.md) {
    Copy-Item README.md "README.previous.md"
}

$banner = @'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#080b21"/>
    <stop offset=".5" stop-color="#191036"/>
    <stop offset="1" stop-color="#071b2a"/>
  </linearGradient>
  <linearGradient id="title" x1="0" x2="1">
    <stop offset="0" stop-color="#7ce7e5"/>
    <stop offset=".5" stop-color="#b9a0ff"/>
    <stop offset="1" stop-color="#ff9bbf"/>
  </linearGradient>
  <radialGradient id="planet" cx=".3" cy=".25" r=".85">
    <stop offset="0" stop-color="#e2baff"/>
    <stop offset=".35" stop-color="#7757c8"/>
    <stop offset="1" stop-color="#1c1b54"/>
  </radialGradient>
  <filter id="glow">
    <feGaussianBlur stdDeviation="8"/>
  </filter>
</defs>

<rect width="1200" height="400" rx="20" fill="url(#bg)"/>

<g fill="#ffffff" opacity=".65">
  <circle cx="60" cy="55" r="2"/>
  <circle cx="170" cy="110" r="1.5"/>
  <circle cx="305" cy="45" r="1.5"/>
  <circle cx="460" cy="92" r="2"/>
  <circle cx="630" cy="42" r="1"/>
  <circle cx="810" cy="75" r="2"/>
  <circle cx="1030" cy="55" r="1.5"/>
  <circle cx="1130" cy="140" r="2"/>
  <circle cx="75" cy="290" r="1.5"/>
  <circle cx="340" cy="345" r="2"/>
  <circle cx="710" cy="320" r="1.5"/>
  <circle cx="1050" cy="345" r="2"/>
</g>

<circle cx="930" cy="195" r="135" fill="#8e67ff" opacity=".18" filter="url(#glow)"/>

<ellipse cx="930" cy="195" rx="190" ry="60"
  fill="none" stroke="#a98dff" stroke-width="2"
  transform="rotate(-22 930 195)" opacity=".7"/>

<circle cx="930" cy="195" r="105" fill="url(#planet)"/>

<ellipse cx="930" cy="195" rx="190" ry="60"
  fill="none" stroke="#b4a0ff" stroke-width="3"
  transform="rotate(-22 930 195)"
  stroke-dasharray="12 8"/>

<circle cx="1080" cy="126" r="11" fill="#75e8e0">
  <animate attributeName="opacity" values=".4;1;.4" dur="3s" repeatCount="indefinite"/>
</circle>

<circle cx="785" cy="265" r="8" fill="#ffb0d4"/>

<text x="75" y="95" fill="#9d91d9"
 font-family="Arial,sans-serif" font-size="18"
 letter-spacing="5">AN IMMERSIVE PERSONAL UNIVERSE</text>

<text x="68" y="212" fill="url(#title)"
 font-family="Arial,sans-serif" font-weight="bold"
 font-size="92" letter-spacing="12">AETHERA</text>

<text x="76" y="265" fill="#f0e9ff"
 font-family="Arial,sans-serif" font-size="24">
 Your mind, reimagined as a universe.
</text>

<text x="76" y="325" fill="#85e9e0"
 font-family="monospace" font-size="16">
 05 CIVILIZATIONS  /  INFINITE POSSIBILITIES
</text>

<rect x="1" y="1" width="1198" height="398" rx="20"
 fill="none" stroke="#7562b5" opacity=".45"/>
</svg>
'@

Set-Content ".github\assets\cosmic-banner.svg" $banner -Encoding UTF8

$readme = @'
<div align="center">

<img src=".github/assets/cosmic-banner.svg" width="100%" alt="AETHERA cosmic universe banner" />

<br/>

### `✦ DON'T JUST ORGANIZE YOUR MIND. EXPLORE IT. ✦`

<br/>

<a href="https://aethera-nine.vercel.app/">
  <img src="https://img.shields.io/badge/ENTER_THE_UNIVERSE-LIVE_DEMO-9B7BFF?style=for-the-badge&labelColor=17132F" />
</a>
<a href="https://github.com/oishipaul45-engineer/AETHERA">
  <img src="https://img.shields.io/badge/EXPLORE_SOURCE-GITHUB-66DCD3?style=for-the-badge&logo=github&labelColor=17132F" />
</a>

<br/><br/>

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=600&size=22&duration=3200&pause=1000&color=B9A0FF&center=true&vCenter=true&width=750&lines=What+if+your+mind+was+a+universe%3F;What+if+your+ideas+became+planets%3F;What+if+you+could+walk+inside+your+thoughts%3F;Welcome+to+AETHERA." alt="Animated AETHERA introduction" />

<br/>

![React](https://img.shields.io/badge/React-15152C?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-15152C?style=flat-square&logo=typescript&logoColor=3178C6)
![Three.js](https://img.shields.io/badge/Three.js-15152C?style=flat-square&logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-15152C?style=flat-square&logo=vite&logoColor=BD9BFF)
![Vercel](https://img.shields.io/badge/Vercel-15152C?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## `01 / THE SIGNAL`

> **Your digital life is scattered. Your mind doesn't have to be.**

Notes live in one application. Goals live in another.
Ideas disappear into forgotten documents.
Projects become endless folders.

**AETHERA transforms all of them into places you can explore.**

Instead of navigating a dashboard, you travel through a personal 3D universe.

Every planet represents something meaningful.
Every planet contains a city.
Every city offers a different activity.

<div align="center">

### `YOUR INFORMATION → YOUR PLANETS → YOUR CIVILIZATIONS`

</div>

---

## `02 / THE FIVE CIVILIZATIONS`

<table>
<tr>
<td width="50%" align="center">

### 🪐 THE POSSIBILITY CITY
**IDEAS**

`#A78BFA`

Plant ideas and develop them through five growth stages.

</td>
<td width="50%" align="center">

### ✧ THE ECHO CITY
**THOUGHTS**

`#5FE1D0`

Combine thoughts and create new connections.

</td>
</tr>
<tr>
<td align="center">

### 📖 THE ARCHIVE CITY
**NOTES**

`#F3ADCB`

Store information inside your personal archive.

</td>
<td align="center">

### ⚙️ THE CREATION CITY
**PROJECTS**

`#FF936D`

Select components and assemble inventions.

</td>
</tr>
<tr>
<td colspan="2" align="center">

### ✨ THE TOMORROW CITY
**GOALS**

`#F4CA79`

Create milestones, complete them, and track your progress.

</td>
</tr>
</table>

---

## `03 / ENTER EXPLORATION MODE`

<div align="center">

### `W A S D` — MOVE THROUGH YOUR WORLD

</div>

| CONTROL | ACTION |
|:---:|---|
| `W` | Walk forward |
| `A` | Move left |
| `S` | Move backward |
| `D` | Move right |
| `SHIFT` | Run |
| `MOUSE DRAG` | Look around |
| `V` | Switch first-person / third-person |
| `E` | Enter or exit an interactive building |

**This is more than a static 3D scene.**

Walk through streets, switch perspectives, discover the Archive interior, and interact with activities tied to your saved planets.

---

## `04 / THE SYSTEM`

```text
                 ✦ A E T H E R A ✦
                         │
                PERSONAL UNIVERSE
                         │
             ┌───────────┴───────────┐
             │                       │
        3D EXPLORATION         PERSONAL DATA
             │                       │
       WALKABLE CITIES          SAVED PLANETS
             │                       │
       CITY ACTIVITIES         CONNECTIONS
             │                       │
             └───────────┬───────────┘
                         │
                 LOCAL PERSISTENCE
                         │
                 YOUR OWN UNIVERSE
```

### Technologies powering the universe

| LAYER | TECHNOLOGY |
|---|---|
| Interface | React + TypeScript |
| 3D Rendering | Three.js |
| React 3D Engine | React Three Fiber |
| 3D Utilities | Drei |
| Development | Vite |
| Styling | CSS |
| Current Data Storage | Browser localStorage |
| Frontend Hosting | Vercel |

---

## `05 / INITIALIZE YOUR OWN UNIVERSE`

**Clone the repository**

```bash
git clone https://github.com/oishipaul45-engineer/AETHERA.git
cd AETHERA/frontend
```

**Install dependencies**

```bash
npm install
```

**Launch AETHERA**

```bash
npm run dev
```

Open the local address shown in your terminal, usually `http://localhost:5173`.

**Build for production**

```bash
npm run build
```

---

## `06 / CURRENT UNIVERSE STATUS`

| SYSTEM | STATUS |
|---|---|
| 3D planet exploration | 🟢 Implemented |
| Planet creation | 🟢 Implemented |
| Planet connections | 🟢 Implemented |
| First-person walking | 🟢 Implemented |
| Third-person exploration | 🟢 Implemented |
| Five city activities | 🟢 Implemented |
| Browser-local persistence | 🟢 Implemented |
| Unique 3D architecture for each city | 🟡 Planned |
| Fully physical 3D activities | 🟡 Planned |
| NPCs and living transportation | 🟡 Planned |
| Accounts and cloud synchronization | 🟡 Planned |
| AI-assisted connections | 🟡 Planned |

> AETHERA is an evolving prototype. Its cities currently share a foundational 3D environment, and the category-specific activities use interactive panels. User data is stored locally in each browser rather than synced across devices.

---

## `07 / THE NEXT UNIVERSE`

- [ ] Unique architecture for every civilization
- [ ] Interactive 3D workshops and laboratories
- [ ] Physical archive shelves and objects
- [ ] Growing 3D idea gardens
- [ ] Towers that evolve with completed goals
- [ ] Characters, vehicles, and ambient city life
- [ ] User accounts and cloud storage
- [ ] Mobile exploration controls
- [ ] AI-assisted knowledge connections

---

<div align="center">

### `✦ THE UNIVERSE IS WAITING ✦`

**What if your digital life wasn't something you scrolled through, but somewhere you could actually go?**

<br/>

<a href="https://aethera-nine.vercel.app/">
  <img src="https://img.shields.io/badge/LAUNCH_AETHERA-ENTER_NOW-B9A0FF?style=for-the-badge&labelColor=15132B" />
</a>

<br/><br/>

Created by **[Oishi Paul](https://github.com/oishipaul45-engineer)**

`BUILT WITH CURIOSITY · POWERED BY IMAGINATION`

</div>
'@

Set-Content README.md $readme -Encoding UTF8

git add README.md .github/assets/cosmic-banner.svg
git commit -m "docs: redesign README as AETHERA cosmic experience"
git push origin main
