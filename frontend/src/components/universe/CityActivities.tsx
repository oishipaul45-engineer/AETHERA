import { useEffect, useState } from "react";
import type { PlanetData } from "../../types/universe";

type CityState = {
  components: string[];
  inventions: string[];
  thoughts: string[];
  insights: string[];
  notes: string[];
  goals: { id: string; text: string; done: boolean }[];
  seeds: { id: string; text: string; stage: number }[];
};

const EMPTY: CityState = {
  components: [],
  inventions: [],
  thoughts: [],
  insights: [],
  notes: [],
  goals: [],
  seeds: [],
};

const COMPONENTS = [
  "Energy Core",
  "Navigation Chip",
  "Memory Crystal",
  "Gravity Ring",
  "Signal Antenna",
];

const STAGES = [
  "Seed",
  "Sprout",
  "Growing",
  "Blooming",
  "Fully Realized",
];

const TITLES: Record<PlanetData["category"], string> = {
  Projects: "THE CREATION LAB",
  Thoughts: "THE ECHO CHAMBER",
  Notes: "THE LIVING ARCHIVE",
  Goals: "THE TOMORROW TOWER",
  Ideas: "THE POSSIBILITY GARDEN",
};

const SUBTITLES: Record<PlanetData["category"], string> = {
  Projects: "Assemble something that has never existed.",
  Thoughts: "Give two thoughts a new meaning.",
  Notes: "Build a collection of knowledge.",
  Goals: "Every completed milestone changes your progress.",
  Ideas: "Watch your ideas grow into something real.",
};

function readState(id: string): CityState {
  try {
    const raw = localStorage.getItem("aethera_city_v1_" + id);
    if (!raw) return { ...EMPTY };
    const data = JSON.parse(raw) as Partial<CityState>;
    return {
      components: Array.isArray(data.components) ? data.components : [],
      inventions: Array.isArray(data.inventions) ? data.inventions : [],
      thoughts: Array.isArray(data.thoughts) ? data.thoughts : [],
      insights: Array.isArray(data.insights) ? data.insights : [],
      notes: Array.isArray(data.notes) ? data.notes : [],
      goals: Array.isArray(data.goals) ? data.goals : [],
      seeds: Array.isArray(data.seeds) ? data.seeds : [],
    };
  } catch {
    return { ...EMPTY };
  }
}

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const panel: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  right: 24,
  transform: "translateY(-50%)",
  width: "min(390px, calc(100vw - 48px))",
  maxHeight: "min(70vh, 650px)",
  overflowY: "auto",
  background: "rgba(12, 13, 31, 0.96)",
  border: "1px solid rgba(184, 168, 255, 0.4)",
  borderRadius: 20,
  padding: 22,
  boxShadow: "0 18px 70px rgba(0,0,0,.5)",
  color: "#f5f1ff",
  zIndex: 60,
  pointerEvents: "auto",
};

const btn: React.CSSProperties = {
  background: "#6f59c9",
  border: "1px solid rgba(255,255,255,.2)",
  borderRadius: 10,
  color: "#fff",
  padding: "11px 14px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
};

const field: React.CSSProperties = {
  background: "#20233b",
  border: "1px solid #515474",
  borderRadius: 10,
  color: "#fff",
  padding: 12,
  width: "100%",
  boxSizing: "border-box",
  fontSize: 13,
};

const item: React.CSSProperties = {
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.09)",
  padding: 12,
  borderRadius: 10,
  marginTop: 9,
  overflowWrap: "anywhere",
};

export default function CityActivities({
  planet,
  inside,
}: {
  planet: PlanetData;
  inside: boolean;
}) {
  const [data, setData] = useState<CityState>(() => readState(planet.id));
  const [text, setText] = useState("");
  const [second, setSecond] = useState("");
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setData(readState(planet.id));
    setText("");
    setSecond("");
    setOpen(true);
    setMessage("");
  }, [planet.id]);

  const save = (next: CityState) => {
    setData(next);
    try {
      localStorage.setItem(
        "aethera_city_v1_" + planet.id,
        JSON.stringify(next)
      );
      setMessage("Saved to this planet.");
    } catch {
      setMessage("Unable to save. Browser storage may be full.");
    }
  };

  const addText = (type: "thoughts" | "notes") => {
    const value = text.trim();
    if (!value) return;
    save({ ...data, [type]: [...data[type], value] });
    setText("");
  };

  const createGoal = () => {
    const value = text.trim();
    if (!value) return;
    save({
      ...data,
      goals: [...data.goals, { id: uid(), text: value, done: false }],
    });
    setText("");
  };

  const createSeed = () => {
    const value = text.trim();
    if (!value) return;
    save({
      ...data,
      seeds: [...data.seeds, { id: uid(), text: value, stage: 0 }],
    });
    setText("");
  };

  const toggleComponent = (component: string) => {
    const selected = data.components.includes(component)
      ? data.components.filter((c) => c !== component)
      : [...data.components, component];
    save({ ...data, components: selected });
  };

  const assemble = () => {
    if (data.components.length < 3) {
      setMessage("Choose at least three components.");
      return;
    }
    const invention = data.components.join(" + ");
    save({
      ...data,
      components: [],
      inventions: [...data.inventions, invention],
    });
  };

  const combine = () => {
    if (!text.trim() || !second.trim()) {
      setMessage("Enter two thoughts first.");
      return;
    }
    const insight = text.trim() + " ↔ " + second.trim();
    save({
      ...data,
      insights: [...data.insights, insight],
    });
    setText("");
    setSecond("");
  };

  const completed = data.goals.filter((g) => g.done).length;
  const progress = data.goals.length
    ? Math.round((completed / data.goals.length) * 100)
    : 0;

  if (!inside) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            ...btn,
            position: "absolute",
            right: 24,
            top: "50%",
            zIndex: 60,
          }}
        >
          OPEN {planet.category.toUpperCase()} ACTIVITY
        </button>
      )}

      {open && (
        <div
          style={panel}
          onPointerDown={(event) => event.stopPropagation()}
          onPointerMove={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "start",
          }}>
            <div>
              <div style={{
                fontSize: 10,
                letterSpacing: ".18em",
                color: "#a99cf5",
              }}>
                AETHERA / {planet.category.toUpperCase()}
              </div>
              <h2 style={{
                fontSize: 21,
                margin: "10px 0",
                fontWeight: 600,
              }}>
                {TITLES[planet.category]}
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ ...btn, padding: "7px 11px" }}
            >
              ×
            </button>
          </div>

          <p style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: "#bdb9d4",
          }}>
            {SUBTITLES[planet.category]}
          </p>

          {planet.category === "Projects" && (
            <section>
              <h3>Invention Workbench</h3>
              <p style={{ fontSize: 12 }}>
                Select at least three parts to assemble an invention.
              </p>
              {COMPONENTS.map((component) => (
                <label
                  key={component}
                  style={{
                    ...item,
                    display: "flex",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={data.components.includes(component)}
                    onChange={() => toggleComponent(component)}
                  />
                  {component}
                </label>
              ))}
              <button
                style={{ ...btn, marginTop: 14, width: "100%" }}
                onClick={assemble}
              >
                ASSEMBLE INVENTION
              </button>
              <h3>Created Inventions ({data.inventions.length})</h3>
              {data.inventions.map((value, i) => (
                <div key={i} style={item}>
                  <strong>Prototype {i + 1}</strong>
                  <p style={{ fontSize: 12 }}>{value}</p>
                </div>
              ))}
            </section>
          )}

          {planet.category === "Thoughts" && (
            <section>
              <h3>Echo Experiment</h3>
              <textarea
                style={{ ...field, minHeight: 65, resize: "vertical" }}
                value={text}
                placeholder="First thought..."
                onChange={(e) => setText(e.target.value)}
              />
              <textarea
                style={{
                  ...field,
                  minHeight: 65,
                  resize: "vertical",
                  marginTop: 10,
                }}
                value={second}
                placeholder="Second thought..."
                onChange={(e) => setSecond(e.target.value)}
              />
              <button
                style={{ ...btn, marginTop: 10, width: "100%" }}
                onClick={combine}
              >
                CREATE CONNECTION
              </button>
              <h3>Discovered Connections</h3>
              {data.insights.map((value, i) => (
                <div key={i} style={item}>
                  ✧ {value}
                </div>
              ))}
            </section>
          )}

          {planet.category === "Notes" && (
            <section>
              <h3>Archive Terminal</h3>
              <textarea
                style={{ ...field, minHeight: 90, resize: "vertical" }}
                value={text}
                placeholder="Write something worth remembering..."
                onChange={(e) => setText(e.target.value)}
              />
              <button
                style={{ ...btn, marginTop: 10, width: "100%" }}
                onClick={() => addText("notes")}
              >
                STORE IN ARCHIVE
              </button>
              <h3>Archive Shelves ({data.notes.length})</h3>
              {data.notes.map((value, i) => (
                <div key={i} style={item}>
                  <div style={{ fontSize: 10, color: "#aaa2ed" }}>
                    SHELF {String(i + 1).padStart(2, "0")}
                  </div>
                  <p style={{ fontSize: 13 }}>{value}</p>
                </div>
              ))}
            </section>
          )}

          {planet.category === "Goals" && (
            <section>
              <h3>Tomorrow Tower</h3>
              <div style={{
                background: "#27253d",
                borderRadius: 10,
                height: 14,
                overflow: "hidden",
              }}>
                <div style={{
                  background: "#eec67c",
                  width: `${progress}%`,
                  height: "100%",
                  transition: "width .4s",
                }} />
              </div>
              <p style={{ fontSize: 12 }}>
                {completed} of {data.goals.length} milestones complete — {progress}%
              </p>
              <input
                style={field}
                value={text}
                placeholder="Your next milestone..."
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createGoal();
                }}
              />
              <button
                style={{ ...btn, marginTop: 10, width: "100%" }}
                onClick={createGoal}
              >
                ADD MILESTONE
              </button>
              {data.goals.map((goal) => (
                <label
                  key={goal.id}
                  style={{
                    ...item,
                    display: "flex",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={goal.done}
                    onChange={() => save({
                      ...data,
                      goals: data.goals.map((g) =>
                        g.id === goal.id
                          ? { ...g, done: !g.done }
                          : g
                      ),
                    })}
                  />
                  <span style={{
                    textDecoration: goal.done ? "line-through" : "none",
                  }}>
                    {goal.text}
                  </span>
                </label>
              ))}
              <div style={{
                display: "flex",
                gap: 5,
                alignItems: "end",
                height: 110,
                marginTop: 20,
              }}>
                {data.goals.map((goal) => (
                  <div
                    key={goal.id}
                    title={goal.text}
                    style={{
                      flex: 1,
                      maxWidth: 35,
                      height: goal.done ? 95 : 28,
                      background: goal.done ? "#eec67c" : "#514966",
                      borderRadius: "5px 5px 0 0",
                      transition: "height .4s",
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {planet.category === "Ideas" && (
            <section>
              <h3>Possibility Garden</h3>
              <input
                style={field}
                value={text}
                placeholder="Plant a new idea..."
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") createSeed();
                }}
              />
              <button
                style={{ ...btn, marginTop: 10, width: "100%" }}
                onClick={createSeed}
              >
                PLANT IDEA
              </button>
              {data.seeds.map((seed) => (
                <div key={seed.id} style={item}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>
                    {["🌱", "🌿", "🪴", "🌸", "🌳"][seed.stage]}
                  </div>
                  <strong>{seed.text}</strong>
                  <p style={{
                    fontSize: 11,
                    color: "#bdb9d4",
                  }}>
                    {STAGES[seed.stage]}
                  </p>
                  <button
                    style={btn}
                    disabled={seed.stage >= 4}
                    onClick={() => save({
                      ...data,
                      seeds: data.seeds.map((s) =>
                        s.id === seed.id
                          ? { ...s, stage: Math.min(4, s.stage + 1) }
                          : s
                      ),
                    })}
                  >
                    {seed.stage >= 4 ? "FULLY GROWN" : "DEVELOP IDEA"}
                  </button>
                </div>
              ))}
            </section>
          )}

          {message && (
            <p
              role="status"
              style={{
                color: "#a3f1d5",
                fontSize: 12,
                marginTop: 15,
              }}
            >
              {message}
            </p>
          )}

          <p style={{
            fontSize: 10,
            color: "#8985a6",
            marginTop: 20,
          }}>
            Your activity progress is stored locally for this planet.
            Close this panel to continue exploring.
          </p>
        </div>
      )}
    </>
  );
}
