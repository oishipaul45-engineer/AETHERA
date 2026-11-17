import { useEffect, useState } from "react";
import Universe from "./components/universe/Universe";

import {
  PLANET_COLORS,
  PLANET_CATEGORIES,
  type PlanetCategory,
  type PlanetData,
  type PlanetConnection,
} from "./types/universe";

import "./App.css";

const PLANET_STORAGE_KEY = "aethera_planets_v1";
const CONNECTION_STORAGE_KEY = "aethera_connections_v1";

const initialPlanets: PlanetData[] = [
  {
    id: "origin",
    title: "The Beginning",
    category: "Ideas",
    content: "Every universe begins with a single thought.",
    position: [0, 0, 0],
  },
  {
    id: "thoughts-1",
    title: "Inner Reflections",
    category: "Thoughts",
    content: "A quiet space for thoughts and reflections.",
    position: [-4.5, 2, -1.5],
  },
  {
    id: "notes-1",
    title: "Fragments",
    category: "Notes",
    content: "Small moments worth remembering.",
    position: [4.5, 2.5, -2],
  },
  {
    id: "projects-1",
    title: "Future Creations",
    category: "Projects",
    content: "A home for everything I want to build.",
    position: [-4, -2.8, -1],
  },
  {
    id: "goals-1",
    title: "Beyond the Horizon",
    category: "Goals",
    content: "Dreams waiting to become reality.",
    position: [4.5, -2.5, -1],
  },
];

function loadPlanets(): PlanetData[] {
  try {
    const stored = localStorage.getItem(PLANET_STORAGE_KEY);
    if (!stored) return initialPlanets;

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return initialPlanets;

    const valid = parsed.every((item) => {
      if (!item || typeof item !== "object") return false;

      const p = item as Partial<PlanetData>;

      return (
        typeof p.id === "string" &&
        typeof p.title === "string" &&
        typeof p.content === "string" &&
        PLANET_CATEGORIES.includes(
          p.category as PlanetCategory
        ) &&
        Array.isArray(p.position) &&
        p.position.length === 3 &&
        p.position.every(
          (n: unknown) =>
            typeof n === "number" && Number.isFinite(n)
        )
      );
    });

    return valid ? (parsed as PlanetData[]) : initialPlanets;
  } catch {
    return initialPlanets;
  }
}

function loadConnections(
  planets: PlanetData[]
): PlanetConnection[] {
  try {
    const stored = localStorage.getItem(CONNECTION_STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const ids = new Set(planets.map((planet) => planet.id));
    const seen = new Set<string>();

    return parsed.filter((item): item is PlanetConnection => {
      if (!item || typeof item !== "object") return false;

      const c = item as Partial<PlanetConnection>;

      if (
        typeof c.id !== "string" ||
        typeof c.sourceId !== "string" ||
        typeof c.targetId !== "string" ||
        !ids.has(c.sourceId) ||
        !ids.has(c.targetId) ||
        c.sourceId === c.targetId
      ) {
        return false;
      }

      const key = [c.sourceId, c.targetId].sort().join(":");

      if (seen.has(key)) return false;
      seen.add(key);

      return true;
    });
  } catch {
    return [];
  }
}

function App() {
  const [planets, setPlanets] = useState<PlanetData[]>(
    loadPlanets
  );

  const [connections, setConnections] = useState<
    PlanetConnection[]
  >(() => loadConnections(loadPlanets()));

  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );

  const [connectingFrom, setConnectingFrom] = useState<
    string | null
  >(null);

  const [showDirectory, setShowDirectory] = useState(false);
  const [creating, setCreating] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [notice, setNotice] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] =
    useState<PlanetCategory>("Ideas");

  const selected = planets.find(
    (planet) => planet.id === selectedId
  );

  const relatedConnections = connections.filter(
    (connection) =>
      connection.sourceId === selectedId ||
      connection.targetId === selectedId
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        PLANET_STORAGE_KEY,
        JSON.stringify(planets)
      );

      localStorage.setItem(
        CONNECTION_STORAGE_KEY,
        JSON.stringify(connections)
      );

      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [planets, connections]);

  function selectPlanet(id: string | null) {
    if (connectingFrom) {
      if (!id) return;

      if (id === connectingFrom) {
        setNotice("Choose a different planet.");
        return;
      }

      const exists = connections.some(
        (connection) =>
          (connection.sourceId === connectingFrom &&
            connection.targetId === id) ||
          (connection.sourceId === id &&
            connection.targetId === connectingFrom)
      );

      if (exists) {
        setNotice("These planets are already connected.");
        setConnectingFrom(null);
        setSelectedId(id);
        return;
      }

      setConnections((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          sourceId: connectingFrom,
          targetId: id,
        },
      ]);

      setConnectingFrom(null);
      setSelectedId(id);
      setNotice("A new constellation connection was created.");
      return;
    }

    setSelectedId(id);
    setCreating(false);
    setNotice("");
  }

  function updatePlanet(changes: Partial<PlanetData>) {
    if (!selectedId) return;

    setPlanets((current) =>
      current.map((planet) =>
        planet.id === selectedId
          ? { ...planet, ...changes }
          : planet
      )
    );
  }

  function createPlanet() {
    const title = newTitle.trim();
    if (!title) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = 5 + Math.random() * 3;

    const planet: PlanetData = {
      id: crypto.randomUUID(),
      title,
      category: newCategory,
      content: "",
      position: [
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        (Math.random() - 0.5) * 3,
      ],
    };

    setPlanets((current) => [...current, planet]);
    setSelectedId(planet.id);
    setNewTitle("");
    setCreating(false);
    setNotice("Your new planet has been created.");
  }

  function deletePlanet() {
    if (!selectedId) return;

    if (!window.confirm("Delete this planet permanently?")) {
      return;
    }

    const deletedId = selectedId;

    setPlanets((current) =>
      current.filter((planet) => planet.id !== deletedId)
    );

    setConnections((current) =>
      current.filter(
        (connection) =>
          connection.sourceId !== deletedId &&
          connection.targetId !== deletedId
      )
    );

    setSelectedId(null);
    setConnectingFrom(null);
    setResetSignal((n) => n + 1);
    setNotice("Planet and its connections deleted.");
  }

  function deleteConnection(connectionId: string) {
    setConnections((current) =>
      current.filter(
        (connection) => connection.id !== connectionId
      )
    );

    setNotice("Connection removed.");
  }

  function startConnecting() {
    if (!selectedId) return;

    setConnectingFrom(selectedId);
    setNotice(
      "Select another planet in 3D or from the constellation list."
    );
  }

  function cancelConnecting() {
    setConnectingFrom(null);
    setNotice("Connection cancelled.");
  }

  function resetView() {
    setSelectedId(null);
    setConnectingFrom(null);
    setCreating(false);
    setNotice("");
    setResetSignal((n) => n + 1);
  }

  function getOtherPlanet(
    connection: PlanetConnection
  ): PlanetData | undefined {
    const otherId =
      connection.sourceId === selectedId
        ? connection.targetId
        : connection.sourceId;

    return planets.find((planet) => planet.id === otherId);
  }

  return (
    <main className="aethera">
      <div className="universe">
        <Universe
          planets={planets}
          connections={connections}
          selectedId={selectedId}
          connectingFrom={connectingFrom}
          onSelect={selectPlanet}
          resetSignal={resetSignal}
        />
      </div>

      <header className="topbar">
        <div className="brand">
          <span className="brand-symbol">✦</span>
          AETHERA
        </div>

        <span className="topbar-status">
          <span className="status-dot" />
          {saveError
            ? "SAVE FAILED"
            : "YOUR UNIVERSE IS ALIVE"}
        </span>
      </header>

      {connectingFrom && (
        <div className="connection-banner">
          <div>
            <strong>✧ CONSTELLATION MODE</strong>
            <p>
              Select another planet to connect your worlds.
            </p>
          </div>

          <button onClick={cancelConnecting}>
            CANCEL
          </button>
        </div>
      )}

      {!selected && !creating && (
        <section className="cosmic-intro">
          <div className="cosmic-intro-line">
            <span className="cosmic-intro-star">✧</span>
            AN EXPLORATION OF YOUR INNER INFINITY
          </div>

          <h1>
            Beyond
            <em> imagination.</em>
          </h1>

          <p>
            Every thought is a world.
            Every connection, a constellation.
          </p>

          <button
            className="cosmic-create"
            onClick={() => {
              setCreating(true);
              setShowDirectory(false);
              setNotice("");
            }}
          >
            <span>✦</span>
            CREATE A WORLD
            <span>↗</span>
          </button>
        </section>
      )}

      <div className="observatory-controls">
        <button
          className="observatory-directory-button"
          aria-expanded={showDirectory}
          onClick={() => setShowDirectory((value) => !value)}
        >
          <span>◎</span>
          {showDirectory ? "CLOSE ATLAS" : "OPEN ATLAS"}
          <span>{planets.length.toString().padStart(2, "0")}</span>
        </button>
      </div>

      <aside
        className={
          "planet-list observatory-directory " +
          (showDirectory ? "directory-visible" : "")
        }
      >
        <div className="list-heading">
          YOUR CONSTELLATION
        </div>

        <div className="planet-count">
          {planets.length} WORLDS · {connections.length} LINKS
        </div>

        {planets.map((planet) => (
          <button
            key={planet.id}
            className={
              "planet-list-item " +
              (selectedId === planet.id ? "active" : "")
            }
            onClick={() => selectPlanet(planet.id)}
          >
            <span
              className="planet-dot"
              style={{
                background: PLANET_COLORS[planet.category],
                boxShadow:
                  `0 0 14px ${PLANET_COLORS[planet.category]}`,
              }}
            />

            <span className="planet-list-label">
              <strong>{planet.title}</strong>
              <small>{planet.category}</small>
            </span>
          </button>
        ))}

        <button
          className="list-create"
          onClick={() => {
            setConnectingFrom(null);
            setSelectedId(null);
            setCreating(true);
            setNotice("");
          }}
        >
          + NEW WORLD
        </button>
      </aside>

      {selected && !creating && (
        <div className="selected-world-caption">
          <span>NOW EXPLORING / {selected.category.toUpperCase()}</span>
          <strong>{selected.title}</strong>
          <small>✧ A WORLD WITHIN YOUR UNIVERSE</small>
        </div>
      )}

      {selected && !creating && (
        <section className="editor-panel">
          <div className="panel-top">
            <span>✦ PLANET EXPLORER</span>

            <button
              className="close-button"
              onClick={resetView}
              aria-label="Close planet editor"
            >
              ×
            </button>
          </div>

          <div
            className="editor-orb"
            style={{
              background:
                `radial-gradient(circle at 30% 25%, ` +
                `#ffffff88, ${PLANET_COLORS[selected.category]})`,
              boxShadow:
                `0 0 45px ${PLANET_COLORS[selected.category]}55`,
            }}
          />

          <label htmlFor="planet-title">
            PLANET NAME
          </label>

          <input
            id="planet-title"
            value={selected.title}
            maxLength={100}
            onChange={(e) =>
              updatePlanet({ title: e.target.value })
            }
          />

          <label htmlFor="planet-category">
            CATEGORY
          </label>

          <select
            id="planet-category"
            value={selected.category}
            onChange={(e) =>
              updatePlanet({
                category:
                  e.target.value as PlanetCategory,
              })
            }
          >
            {PLANET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="planet-content">
            YOUR THOUGHTS
          </label>

          <textarea
            id="planet-content"
            value={selected.content}
            placeholder="Write something meaningful..."
            rows={5}
            onChange={(e) =>
              updatePlanet({ content: e.target.value })
            }
          />

          <div className="save-indicator">
            {saveError
              ? "Unable to save in this browser"
              : "✧ Saved locally"}
          </div>

          <div className="connections-section">
            <div className="connections-heading">
              <span>✧ CELESTIAL CONNECTIONS</span>
              <span>{relatedConnections.length}</span>
            </div>

            {relatedConnections.length === 0 ? (
              <p className="connections-empty">
                This planet is waiting to connect with
                another world.
              </p>
            ) : (
              <div className="connection-items">
                {relatedConnections.map((connection) => {
                  const other = getOtherPlanet(connection);

                  if (!other) return null;

                  return (
                    <div
                      className="connection-item"
                      key={connection.id}
                    >
                      <button
                        className="connection-target"
                        onClick={() => selectPlanet(other.id)}
                      >
                        <span
                          className="planet-dot"
                          style={{
                            background:
                              PLANET_COLORS[other.category],
                          }}
                        />
                        {other.title}
                      </button>

                      <button
                        className="remove-connection"
                        aria-label={
                          `Remove connection to ${other.title}`
                        }
                        title="Remove connection"
                        onClick={() =>
                          deleteConnection(connection.id)
                        }
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              className="connect-button"
              onClick={
                connectingFrom
                  ? cancelConnecting
                  : startConnecting
              }
            >
              {connectingFrom
                ? "CANCEL CONNECTION"
                : "+ CONNECT TO ANOTHER PLANET"}
            </button>
          </div>

          <button
            className="delete-button"
            onClick={deletePlanet}
          >
            DELETE PLANET
          </button>
        </section>
      )}

      {creating && (
        <section className="editor-panel create-panel">
          <div className="panel-top">
            <span>✦ BIRTH OF A NEW WORLD</span>

            <button
              className="close-button"
              onClick={() => setCreating(false)}
              aria-label="Close creation form"
            >
              ×
            </button>
          </div>

          <h2>Create a planet.</h2>

          <p>
            Give your thought a name, and let it find its
            place among the stars.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createPlanet();
            }}
          >
            <label htmlFor="new-title">
              PLANET NAME
            </label>

            <input
              id="new-title"
              value={newTitle}
              maxLength={100}
              autoFocus
              placeholder="A new beginning..."
              onChange={(e) =>
                setNewTitle(e.target.value)
              }
            />

            <label htmlFor="new-category">
              CATEGORY
            </label>

            <select
              id="new-category"
              value={newCategory}
              onChange={(e) =>
                setNewCategory(
                  e.target.value as PlanetCategory
                )
              }
            >
              {PLANET_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              className="primary-button create-submit"
              type="submit"
              disabled={!newTitle.trim()}
            >
              ✦ BRING PLANET TO LIFE
            </button>
          </form>
        </section>
      )}

      {notice && (
        <div className="universe-notice" role="status">
          ✧ {notice}
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}

      <div className="bottom-info">
        <span>✧ A UNIVERSE OF POSSIBILITIES</span>

        <button onClick={resetView}>
          RESET VIEW ↗
        </button>

        <span>
          DRAG TO EXPLORE · SCROLL TO ZOOM
        </span>
      </div>
    </main>
  );
}

export default App;

