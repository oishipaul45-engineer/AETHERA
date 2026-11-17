
cd C:\Users\Oishi\Desktop\AETHERA

$readme = @'
<div align="center">

# AETHERA
### Your Mind, Reimagined as a Universe

**Don't just organize your mind. Explore it.**

An immersive 3D personal universe where ideas, thoughts, notes, projects, and goals become explorable planets.

[Explore AETHERA](https://aethera-nine.vercel.app/) · [GitHub Repository](https://github.com/oishipaul45-engineer/AETHERA)

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active_Prototype-8B5CF6)

</div>

---

## About AETHERA

Traditional productivity applications organize information through folders, lists, and dashboards.

**AETHERA takes a different approach.**

It transforms personal information into an immersive, interactive 3D universe.

Each planet represents something meaningful to the user, and each planet contains a city with activities designed around its purpose.

AETHERA combines spatial exploration, creativity, and personal organization in one experience.

## The Five Civilizations

| Planet Category | Civilization | Interactive Experience |
|---|---|---|
| Projects | Creation City | Assemble and save inventions using selected components |
| Thoughts | Echo City | Combine thoughts to create meaningful connections |
| Notes | Archive City | Write and store notes in a personal archive |
| Goals | Tomorrow City | Create milestones and track their completion |
| Ideas | Possibility City | Plant ideas and develop them through growth stages |

Every planet has its own activity data and saved progress.

## Features

- Interactive 3D universe with selectable planets
- Five categories of personal information
- Planet creation and exploration
- Visual connections between planets
- Walkable city environments
- First-person and third-person camera modes
- Keyboard movement and running
- Building collision detection
- Accessible interactive interior
- Five category-specific activities
- Browser-based progress persistence
- Responsive web deployment

## Exploration Controls

| Key | Action |
|---|---|
| W | Move forward |
| A | Move left |
| S | Move backward |
| D | Move right |
| Shift | Run |
| Mouse drag | Look around |
| V | Switch camera mode |
| E | Enter or exit a building |

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- CSS

### Backend
The repository also contains a Python backend workspace. The current public Vercel deployment serves the frontend.

### Storage
The current prototype uses browser localStorage for planets, connections, and city activity progress.

Cloud-based synchronization and user authentication are future improvements.

## Project Structure

```text
AETHERA/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── universe/
│   │   │       ├── Universe.tsx
│   │   │       ├── LivingCity.tsx
│   │   │       └── CityActivities.tsx
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── backend/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install Node.js and npm.

### 1. Clone the repository

```bash
git clone https://github.com/oishipaul45-engineer/AETHERA.git
cd AETHERA/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, normally:

http://localhost:5173

### 4. Build for production

```bash
npm run build
```

## How AETHERA Works

1. Create a planet and choose its category.
2. Give the planet a title and content.
3. Explore the planet in the 3D universe.
4. Enter its hidden city.
5. Walk around using keyboard controls.
6. Enter the interactive building.
7. Complete the activity associated with that planet.
8. Return to your universe and explore another world.

## Current Limitations

AETHERA is an evolving prototype.

- Data is currently stored in the visitor's browser.
- User accounts and cross-device synchronization are not yet implemented.
- The five civilizations share a foundational city environment.
- Activities currently use interactive interfaces rather than fully physical 3D manipulation.
- Advanced NPCs, transport systems, and unique city architecture are planned.

## Future Roadmap

- [ ] Distinct architecture and environments for all five civilizations
- [ ] Fully interactive 3D interiors
- [ ] Physical object manipulation
- [ ] NPCs and living city environments
- [ ] Transportation between city districts
- [ ] User authentication
- [ ] Cloud database and synchronization
- [ ] Mobile exploration controls
- [ ] AI-assisted discovery of connections between ideas
- [ ] Dynamic city evolution based on user progress

## Live Demo

Experience the project:

**https://aethera-nine.vercel.app/**

## Project Vision

AETHERA explores a simple question:

**What if your digital life wasn't something you scrolled through, but somewhere you could actually go?**

The long-term vision is to transform personal knowledge management into a spatial, immersive experience where information can be explored, developed, and connected.

---

<div align="center">

### AETHERA

*An entire universe, built from your mind.*

Created by [Oishi Paul](https://github.com/oishipaul45-engineer)

</div>
'@

Set-Content -Path README.md -Value $readme -Encoding UTF8

git add README.md
git commit -m "docs: add professional AETHERA README"
git push origin main
