
# ============================================
# AETHERA — COMPLETE COSMIC README INSTALLER
# ============================================

$ErrorActionPreference = "Stop"

cd C:\Users\Oishi\Desktop\AETHERA

# 1. Backup existing README
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"

if (Test-Path README.md) {
    Copy-Item README.md "README-backup-$stamp.txt"
}

# 2. Create assets folder
New-Item -ItemType Directory -Force ".github\assets" | Out-Null

# 3. Create the cosmic SVG banner
$banner = @'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="420" viewBox="0 0 1200 420">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#08091e"/>
    <stop offset="55%" stop-color="#21123f"/>
    <stop offset="100%" stop-color="#092b38"/>
  </linearGradient>
  <linearGradient id="heading" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#76e9df"/>
    <stop offset="48%" stop-color="#b89aff"/>
    <stop offset="100%" stop-color="#ff9ec8"/>
  </linearGradient>
  <radialGradient id="world" cx="30%" cy="25%" r="85%">
    <stop offset="0%" stop-color="#e1c3ff"/>
    <stop offset="38%" stop-color="#8059c9"/>
    <stop offset="100%" stop-color="#21133f"/>
  </radialGradient>
  <filter id="blur">
    <feGaussianBlur stdDeviation="17"/>
  </filter>
</defs>

<rect width="1200" height="420" rx="22" fill="url(#bg)"/>

<circle cx="930" cy="205" r="150" fill="#956aff" opacity=".24" filter="url(#blur)"/>

<g fill="#ffffff">
  <circle cx="52" cy="43" r="1.5" opacity=".7"/>
  <circle cx="180" cy="98" r="1.2" opacity=".6"/>
  <circle cx="320" cy="52" r="1.7" opacity=".7"/>
  <circle cx="455" cy="110" r="1.1" opacity=".8"/>
  <circle cx="625" cy="48" r="1.5" opacity=".7"/>
  <circle cx="760" cy="90" r="1.1" opacity=".7"/>
  <circle cx="1080" cy="50" r="2" opacity=".8"/>
  <circle cx="1120" cy="310" r="1.5" opacity=".7"/>
  <circle cx="310" cy="350" r="1.6" opacity=".7"/>
  <circle cx="70" cy="320" r="1.2" opacity=".7"/>
  <circle cx="600" cy="365" r="1.5" opacity=".6"/>
</g>

<ellipse cx="935" cy="210" rx="204" ry="67"
  transform="rotate(-23 935 210)"
  fill="none" stroke="#b39aff" stroke-width="2" opacity=".8"/>

<circle cx="935" cy="210" r="110" fill="url(#world)"/>

<ellipse cx="935" cy="210" rx="204" ry="67"
  transform="rotate(-23 935 210)"
  fill="none" stroke="#e4c5ff" stroke-width="3"
  stroke-dasharray="14 11" opacity=".85"/>

<circle cx="1098" cy="137" r="12" fill="#6ef0df">
  <animate attributeName="opacity"
    values=".4;1;.4" dur="3s" repeatCount="indefinite"/>
</circle>

<circle cx="773" cy="285" r="8" fill="#ff9fc9"/>

<text x="74" y="92" fill="#a99ce4"
  font-family="Arial,sans-serif" font-size="17"
  letter-spacing="5">
  AN IMMERSIVE PERSONAL UNIVERSE
</text>

<text x="65" y="218" fill="url(#heading)"
  font-family="Arial,sans-serif"
  font-weight="bold" font-size="94"
  letter-spacing="12">
  AETHERA
</text>

<text x="75" y="275" fill="#f1eaff"
  font-family="Arial,sans-serif" font-size="24">
  Your mind, reimagined as a universe.
</text>

<text x="75" y="344" fill="#7be8df"
  font-family="monospace" font-size="17">
  05 CIVILIZATIONS  /  INFINITE POSSIBILITIES
</text>

<rect x="1" y="1" width="1198" height="418"
  rx="22" fill="none" stroke="#7d66b5"
  opacity=".5"/>
</svg>
'@

# 4. Create the civilization visualization
$civilizations = @'
<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="310" viewBox="0 0 1100 310">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#101126"/>
    <stop offset="100%" stop-color="#1b1735"/>
  </linearGradient>
  <radialGradient id="purple">
    <stop offset="0%" stop-color="#d8baff"/>
    <stop offset="100%" stop-color="#7650ba"/>
  </radialGradient>
  <radialGradient id="teal">
    <stop offset="0%" stop-color="#c6fff2"/>
    <stop offset="100%" stop-color="#2b9d9a"/>
  </radialGradient>
  <radialGradient id="pink">
    <stop offset="0%" stop-color="#ffd5e9"/>
    <stop offset="100%" stop-color="#c36b9d"/>
  </radialGradient>
  <radialGradient id="orange">
    <stop offset="0%" stop-color="#ffd6b0"/>
    <stop offset="100%" stop-color="#d06b4a"/>
  </radialGradient>
  <radialGradient id="gold">
    <stop offset="0%" stop-color="#fff0b8"/>
    <stop offset="100%" stop-color="#c49b48"/>
  </radialGradient>
</defs>

<rect width="1100" height="310" rx="22" fill="url(#bg)"/>

<g stroke="#77708f" stroke-width="1" opacity=".4">
  <path d="M110 150 L330 150 L550 150 L770 150 L990 150" fill="none"/>
</g>

<g>
  <circle cx="110" cy="150" r="53" fill="url(#purple)"/>
  <circle cx="330" cy="150" r="53" fill="url(#teal)"/>
  <circle cx="550" cy="150" r="53" fill="url(#pink)"/>
  <circle cx="770" cy="150" r="53" fill="url(#orange)"/>
  <circle cx="990" cy="150" r="53" fill="url(#gold)"/>
</g>

<g fill="none" stroke="#ffffff" stroke-width="1.4" opacity=".6">
  <ellipse cx="110" cy="150" rx="72" ry="23" transform="rotate(-25 110 150)"/>
  <ellipse cx="330" cy="150" rx="72" ry="23" transform="rotate(18 330 150)"/>
  <ellipse cx="550" cy="150" rx="72" ry="23" transform="rotate(-15 550 150)"/>
  <ellipse cx="770" cy="150" rx="72" ry="23" transform="rotate(25 770 150)"/>
  <ellipse cx="990" cy="150" rx="72" ry="23" transform="rotate(-25 990 150)"/>
</g>

<g fill="#f4edff" font-family="Arial,sans-serif" font-size="17" text-anchor="middle">
  <text x="110" y="252">IDEAS</text>
  <text x="330" y="252">THOUGHTS</text>
  <text x="550" y="252">NOTES</text>
  <text x="770" y="252">PROJECTS</text>
  <text x="990" y="252">GOALS</text>
</g>

<text x="550" y="44" text-anchor="middle"
  fill="#b7a5f0" font-family="Arial,sans-serif"
  font-size="17" letter-spacing="4">
  FIVE WORLDS. FIVE PURPOSES. ONE UNIVERSE.
</text>
</svg>
'@

# 5. Write SVG assets
Set-Content -Path ".github\assets\cosmic-banner.svg" -Value $banner -Encoding UTF8
Set-Content -Path ".github\assets\civilizations.svg" -Value $civilizations -Encoding UTF8

# 6. Create the complete README
$readme = @'
<div align="center">

<img src=".github/assets/cosmic-banner.svg" width="100%" alt="AETHERA Cosmic Universe" />

<br/>

### ✦ DON'T JUST ORGANIZE YOUR MIND. EXPLORE IT. ✦

<br/>

<a href="https://aethera-nine.vercel.app/">
  <img src="https://img.shields.io/badge/ENTER_THE_UNIVERSE-LIVE_DEMO-A78BFA?style=for-the-badge&amp;labelColor=17132F" alt="Live Demo"/>
</a>

<a href="https://github.com/oishipaul45-engineer/AETHERA">
  <img src="https://img.shields.io/badge/EXPLORE_THE_CODE-GITHUB-5FE1D0?style=for-the-badge&amp;logo=github&amp;labelColor=17132F" alt="GitHub"/>
</a>

<br/><br/>

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&amp;weight=600&amp;size=23&amp;duration=3500&amp;pause=1000&amp;color=B9A0FF&amp;center=true&amp;vCenter=true&amp;width=750&amp;lines=What+if+your+mind+was+a+universe%3F;What+if+your+ideas+became+planets%3F;What+if+you+could+explore+your+thoughts%3F;Welcome+to+AETHERA." alt="Animated introduction"/>

<br/><br/>

![React](https://img.shields.io/badge/React-15152C?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-15152C?style=flat-square&logo=typescript&logoColor=3178C6)
![Three.js](https://img.shields.io/badge/Three.js-15152C?style=flat-square&logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-15152C?style=flat-square&logo=vite&logoColor=BD9BFF)
![Vercel](https://img.shields.io/badge/Vercel-15152C?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 01 / THE SIGNAL

> **Your digital life is scattered. Your mind doesn't have to be.**

Notes live in one application. Goals live in another. Ideas disappear into forgotten documents. Projects become endless folders.

**AETHERA transforms them into places you can explore.**

Instead of scrolling through an ordinary dashboard, you navigate a personal 3D universe.

Every planet represents something meaningful. Every planet contains an explorable city. Every city offers a different activity.

<div align="center">

### YOUR INFORMATION → YOUR PLANETS → YOUR CIVILIZATIONS

</div>

---

## 02 / THE FIVE CIVILIZATIONS

<div align="center">

<img src=".github/assets/civilizations.svg" width="100%" alt="Five AETHERA civilizations"/>

</div>

<table>
<tr>
<td width="50%" align="center">

### 🪐 POSSIBILITY CITY

**IDEAS**

Plant ideas and develop them through five growth stages.

</td>
<td width="50%" align="center">

### ✧ ECHO CITY

**THOUGHTS**

Combine thoughts and discover meaningful connections.

</td>
</tr>
<tr>
<td align="center">

### 📖 ARCHIVE CITY

**NOTES**

Write and store knowledge inside a personal archive.

</td>
<td align="center">

### ⚙️ CREATION CITY

**PROJECTS**

Select components and assemble your own inventions.

</td>
</tr>
<tr>
<td colspan="2" align="center">

### ✨ TOMORROW CITY

**GOALS**

Create milestones, complete them, and track your progress.

</td>
</tr>
</table>

---

## 03 / ENTER EXPLORATION MODE

<div align="center">

### `W A S D` — WALK THROUGH YOUR WORLD

</div>

| CONTROL | ACTION |
|:---:|---|
| `W` | Walk forward |
| `A` | Move left |
| `S` | Move backward |
| `D` | Move right |
| `SHIFT` | Run |
| `MOUSE DRAG` | Look around |
| `V` | Switch between first-person and third-person |
| `E` | Enter or exit a building |

AETHERA combines 3D navigation with interactive activities connected to your own saved information.

---

## 04 / THE UNIVERSE ENGINE

```text
                     ✦ AETHERA ✦
                          │
                  PERSONAL UNIVERSE
                          │
             ┌────────────┴────────────┐
             │                         │
       3D EXPLORATION            PERSONAL DATA
             │                         │
       WALKABLE CITIES             PLANETS
             │                         │
       CITY ACTIVITIES            CONNECTIONS
             │                         │
             └────────────┬────────────┘
                          │
                   LOCAL STORAGE
                          │
                   YOUR UNIVERSE
```

### Technology Stack

| LAYER | TECHNOLOGY |
|---|---|
| Frontend | React + TypeScript |
| 3D Rendering | Three.js |
| 3D React Engine | React Three Fiber |
| 3D Helpers | Drei |
| Build Tool | Vite |
| Styling | CSS |
| Current Storage | Browser localStorage |
| Frontend Hosting | Vercel |

---

## 05 / INITIALIZE YOUR UNIVERSE

**Clone the repository**

```bash
git clone https://github.com/oishipaul45-engineer/AETHERA.git
cd AETHERA/frontend
```

**Install dependencies**

```bash
npm install
```

**Start the universe**

```bash
npm run dev
```

Open the development URL shown in the terminal, usually `http://localhost:5173`.

**Build for production**

```bash
npm run build
```

---

## 06 / UNIVERSE STATUS

| SYSTEM | STATUS |
|---|---|
| 3D universe and planets | 🟢 Implemented |
| Planet creation | 🟢 Implemented |
| Planet connections | 🟢 Implemented |
| First-person exploration | 🟢 Implemented |
| Third-person exploration | 🟢 Implemented |
| Five interactive city activities | 🟢 Implemented |
| Browser-local persistence | 🟢 Implemented |
| Unique city architecture | 🟡 Planned |
| Fully physical 3D activities | 🟡 Planned |
| Living NPCs and transportation | 🟡 Planned |
| Cloud accounts and synchronization | 🟡 Planned |
| AI-assisted knowledge connections | 🟡 Planned |

> **Prototype note:** The five city categories currently share a foundational walkable environment. Their activities are interactive interfaces rather than fully physical 3D simulations. Data is saved in each visitor's browser.

---

## 07 / THE NEXT UNIVERSE

- [ ] Five visually distinct 3D civilizations
- [ ] Interactive laboratories and workshops
- [ ] Physical archives and knowledge objects
- [ ] Growing 3D idea gardens
- [ ] Towers that evolve with goal completion
- [ ] Living characters and city transportation
- [ ] User authentication and cloud storage
- [ ] Mobile exploration controls
- [ ] AI-assisted discovery of connections

---

<div align="center">

### ✦ THE UNIVERSE IS WAITING ✦

**What if your digital life wasn't something you scrolled through, but somewhere you could actually go?**

<br/>

<a href="https://aethera-nine.vercel.app/">
<img src="https://img.shields.io/badge/LAUNCH_AETHERA-ENTER_NOW-B9A0FF?style=for-the-badge&amp;labelColor=15132B" alt="Launch AETHERA"/>
</a>

<br/><br/>

Created by **[Oishi Paul](https://github.com/oishipaul45-engineer)**

`BUILT WITH CURIOSITY · POWERED BY IMAGINATION`

</div>
'@

Set-Content -Path README.md -Value $readme -Encoding UTF8

# 7. Validate generated files
Add-Type -AssemblyName System.Xml.Linq

foreach ($file in @(
    ".github\assets\cosmic-banner.svg",
    ".github\assets\civilizations.svg"
)) {
    [System.Xml.Linq.XDocument]::Load(
        (Resolve-Path $file).Path
    ) | Out-Null
}

if ((Get-Content README.md -Raw) -notmatch "THE FIVE CIVILIZATIONS") {
    throw "README validation failed."
}

Write-Host "`nREADME and SVG files validated!" -ForegroundColor Green

# 8. Commit only the intended files
git add README.md .github/assets/cosmic-banner.svg .github/assets/civilizations.svg

git commit -m "docs: create AETHERA cosmic README experience"

if ($LASTEXITCODE -ne 0) {
    throw "Git commit failed. Check the output above."
}

# 9. Push to GitHub
git push origin main

if ($LASTEXITCODE -ne 0) {
    throw "Git push failed. Check the output above."
}

Write-Host "`nAETHERA COSMIC README PUBLISHED!" -ForegroundColor Cyan
Write-Host "https://github.com/oishipaul45-engineer/AETHERA" -ForegroundColor Magenta
