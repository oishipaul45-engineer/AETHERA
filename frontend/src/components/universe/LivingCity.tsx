import CityActivities from "./CityActivities";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import {
  PLANET_COLORS,
  type PlanetData,
} from "../../types/universe";

type Building = {
  x: number;
  z: number;
  height: number;
  index: number;
};

type ViewMode = "first" | "third";

function generateBuildings(id: string): Building[] {
  let seed = 0;
  for (const letter of id) {
    seed = (Math.imul(seed, 31) + letter.charCodeAt(0)) | 0;
  }

  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };

  const result: Building[] = [];

  for (const x of [-6, -3.5, 3.5, 6]) {
    for (const z of [-8, -4, 0, 4, 8]) {
      result.push({
        x,
        z,
        height: 3.5 + random() * 9,
        index: result.length,
      });
    }
  }

  return result;
}

function CityBuilding({
  data,
  color,
}: {
  data: Building;
  color: string;
}) {
  const floors = Math.floor(data.height / 0.8);

  return (
    <group position={[data.x, 0, data.z]}>
      <mesh position={[0, data.height / 2, 0]}>
        <boxGeometry args={[2, data.height, 2.2]} />
        <meshStandardMaterial
          color={data.index % 2 ? "#252c48" : "#32263e"}
          metalness={0.45}
          roughness={0.45}
        />
      </mesh>

      <mesh position={[0, data.height + 0.05, 0]}>
        <boxGeometry args={[2.15, 0.12, 2.35]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.3}
        />
      </mesh>

      {Array.from({ length: floors }, (_, i) => (
        <group key={i}>
          {[-0.55, 0, 0.55].map((x) => (
            <mesh
              key={x}
              position={[x, 0.75 + i * 0.8, 1.108]}
            >
              <planeGeometry args={[0.3, 0.42]} />
              <meshBasicMaterial
                color={
                  (i + data.index) % 4 === 0
                    ? "#ffe5a4"
                    : "#83dce8"
                }
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}

      {data.x === 3.5 && data.z === 4 && (
        <group position={[-1.025, 0, 0]}>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[0.06, 2.3, 1.4]} />
            <meshBasicMaterial color="#121b30" />
          </mesh>
          <mesh position={[-0.045, 1.15, 0]}>
            <boxGeometry args={[0.025, 2.05, 1.15]} />
            <meshBasicMaterial
              color="#62eadc"
              transparent
              opacity={0.38}
            />
          </mesh>
          <mesh position={[-0.08, 2.4, 0]}>
            <boxGeometry args={[0.12, 0.09, 1.5]} />
            <meshBasicMaterial color="#b8fff2" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function CityInterior({
  color,
}: {
  color: string;
}) {
  return (
    <group>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[11, 0.16, 11]} />
        <meshStandardMaterial color="#24243c" />
      </mesh>

      <mesh position={[0, 3.8, -5.5]}>
        <boxGeometry args={[11, 7.6, 0.2]} />
        <meshStandardMaterial color="#25283f" />
      </mesh>

      <mesh position={[-5.5, 3.8, 0]}>
        <boxGeometry args={[0.2, 7.6, 11]} />
        <meshStandardMaterial color="#25283f" />
      </mesh>

      <mesh position={[5.5, 3.8, 0]}>
        <boxGeometry args={[0.2, 7.6, 11]} />
        <meshStandardMaterial color="#25283f" />
      </mesh>

      <mesh position={[0, 7.6, 0]}>
        <boxGeometry args={[11, 0.15, 11]} />
        <meshStandardMaterial color="#1c1e35" />
      </mesh>

      {[-3, 0, 3].map((x) => (
        <group key={x} position={[x, 0, -3.8]}>
          <mesh position={[0, 1.25, 0]}>
            <boxGeometry args={[2, 2.5, 0.65]} />
            <meshStandardMaterial
              color="#343650"
              metalness={0.6}
            />
          </mesh>

          <mesh position={[0, 1.7, 0.35]}>
            <planeGeometry args={[1.5, 1.1]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.65}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.3, 1.5, 1.3, 8]} />
        <meshStandardMaterial
          color="#30304d"
          metalness={0.65}
        />
      </mesh>

      <mesh position={[0, 1.8, 0]}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          wireframe
        />
      </mesh>

      <pointLight
        position={[0, 5, 0]}
        intensity={24}
        distance={12}
        color={color}
      />

      <pointLight
        position={[0, 4, 4]}
        intensity={12}
        distance={12}
        color="#8de9f1"
      />
    </group>
  );
}

function MovingDrone({
  index,
  color,
}: {
  index: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime * 0.25 + index * 2.1;
    ref.current.position.set(
      Math.sin(t) * (4 + index),
      6 + index * 1.1 + Math.sin(t * 2) * 0.4,
      Math.cos(t) * 7
    );
    ref.current.rotation.y = t;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.13, 0]}>
        <boxGeometry args={[0.65, 0.035, 0.18]} />
        <meshBasicMaterial color="#a5f7ff" />
      </mesh>
      <pointLight
        color={color}
        intensity={3}
        distance={2}
      />
    </group>
  );
}

function CityWorld({
  planet,
  mode,
  inside,
  onEnter,
  onExit,
  onNearby,
  onPosition,
  keys,
  look,
}: {
  planet: PlanetData;
  mode: ViewMode;
  inside: boolean;
  onEnter: () => void;
  onExit: () => void;
  onNearby: (near: boolean) => void;
  onPosition: (position: string) => void;
  keys: React.RefObject<Set<string>>;
  look: React.RefObject<{ yaw: number; pitch: number }>;
}) {
  const { camera } = useThree();
  const player = useRef(new THREE.Vector3(0, 0, 9));
  const avatar = useRef<THREE.Group>(null);
  const lastNearby = useRef(false);
  const lastPosition = useRef("");
  const actionHeld = useRef(false);

  const color = PLANET_COLORS[planet.category];
  const buildings = useMemo(
    () => generateBuildings(planet.id),
    [planet.id]
  );

  useEffect(() => {
    player.current.set(0, 0, inside ? 3.5 : 9);
    look.current.yaw = 0;
    look.current.pitch = 0;
    actionHeld.current = false;
  }, [inside, look]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const pressed = keys.current;
    const yaw = look.current.yaw;

    const forward = new THREE.Vector3(
      -Math.sin(yaw),
      0,
      -Math.cos(yaw)
    );

    const right = new THREE.Vector3(
      Math.cos(yaw),
      0,
      -Math.sin(yaw)
    );

    const direction = new THREE.Vector3();

    if (pressed.has("w") || pressed.has("arrowup")) {
      direction.add(forward);
    }
    if (pressed.has("s") || pressed.has("arrowdown")) {
      direction.sub(forward);
    }
    if (pressed.has("d") || pressed.has("arrowright")) {
      direction.add(right);
    }
    if (pressed.has("a") || pressed.has("arrowleft")) {
      direction.sub(right);
    }

    if (direction.lengthSq() > 0) {
      direction.normalize();
      const speed = pressed.has("shift") ? 7 : 4;
      const next = player.current.clone().addScaledVector(
        direction,
        speed * dt
      );

      if (inside) {
        next.x = THREE.MathUtils.clamp(next.x, -4.6, 4.6);
        next.z = THREE.MathUtils.clamp(next.z, -4.6, 4.6);
      } else {
        next.x = THREE.MathUtils.clamp(next.x, -10, 10);
        next.z = THREE.MathUtils.clamp(next.z, -12, 12);

        const collision = buildings.some(
          (b) =>
            Math.abs(next.x - b.x) < 1.3 &&
            Math.abs(next.z - b.z) < 1.45
        );

        if (collision) {
          const slideX = player.current.clone();
          slideX.x = next.x;
          const blockedX = buildings.some(
            (b) =>
              Math.abs(slideX.x - b.x) < 1.3 &&
              Math.abs(slideX.z - b.z) < 1.45
          );

          const slideZ = player.current.clone();
          slideZ.z = next.z;
          const blockedZ = buildings.some(
            (b) =>
              Math.abs(slideZ.x - b.x) < 1.3 &&
              Math.abs(slideZ.z - b.z) < 1.45
          );

          if (!blockedX) player.current.x = slideX.x;
          if (!blockedZ) player.current.z = slideZ.z;
        } else {
          player.current.copy(next);
        }
      }

      if (inside) player.current.copy(next);
    }

    const nearDoor =
      !inside &&
      player.current.distanceTo(
        new THREE.Vector3(1.8, 0, 4)
      ) < 2.2;

    if (nearDoor !== lastNearby.current) {
      lastNearby.current = nearDoor;
      onNearby(nearDoor);
    }

    const ePressed = pressed.has("e");

    if (ePressed && !actionHeld.current) {
      if (inside) onExit();
      else if (nearDoor) onEnter();
    }

    actionHeld.current = ePressed;

    const location = `${Math.round(player.current.x)}, ${Math.round(player.current.z)}`;
    if (location !== lastPosition.current) {
      lastPosition.current = location;
      onPosition(location);
    }

    const eye = player.current.clone();
    eye.y = 1.7;

    const pitch = look.current.pitch;
    const gaze = new THREE.Vector3(
      -Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    );

    const desired = eye.clone();

    if (mode === "third") {
      desired.addScaledVector(forward, -4);
      desired.y += 1.5;
    }

    camera.position.lerp(
      desired,
      1 - Math.exp(-dt * 12)
    );

    const target = eye.clone().addScaledVector(gaze, 8);

    if (mode === "third") {
      target.copy(eye);
      target.addScaledVector(gaze, 3);
    }

    camera.lookAt(target);

    if (avatar.current) {
      avatar.current.visible = mode === "third";
      avatar.current.position.copy(player.current);
      avatar.current.rotation.y = yaw;
    }
  });

  return (
    <>
      <color attach="background" args={["#090c20"]} />
      <fog attach="fog" args={["#101329", 16, 48]} />

      <ambientLight intensity={1.25} />
      <hemisphereLight
        args={["#8f9dff", "#15111e", 2]}
      />

      <directionalLight
        position={[8, 16, 4]}
        intensity={3}
        color="#c2c6ff"
      />

      <Stars
        radius={100}
        depth={40}
        count={1600}
        factor={3}
        fade
      />

      {inside ? (
        <CityInterior color={color} />
      ) : (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
              color="#14182b"
              roughness={0.9}
            />
          </mesh>

          <mesh
            position={[0, 0.012, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[3.6, 27]} />
            <meshStandardMaterial color="#24283c" />
          </mesh>

          {[-10, -6, -2, 2, 6, 10].map((z) => (
            <group key={z}>
              <mesh
                position={[0, 0.025, z]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[0.09, 1.25]} />
                <meshBasicMaterial color="#e8d9ae" />
              </mesh>

              {[-1.9, 1.9].map((x) => (
                <mesh
                  key={x}
                  position={[x, 0.045, z]}
                >
                  <boxGeometry args={[0.07, 0.05, 3.6]} />
                  <meshBasicMaterial color={color} />
                </mesh>
              ))}
            </group>
          ))}

          {buildings.map((b) => (
            <CityBuilding
              key={b.index}
              data={b}
              color={color}
            />
          ))}

          {[-10, -6, -2, 2, 6, 10].map((z) => (
            <group key={`lamp-${z}`}>
              {[-2.1, 2.1].map((x) => (
                <group key={x} position={[x, 0, z]}>
                  <mesh position={[0, 2.5, 0]}>
                    <cylinderGeometry args={[0.045, 0.06, 5, 8]} />
                    <meshStandardMaterial color="#51516d" />
                  </mesh>
                  <mesh position={[0, 5.05, 0]}>
                    <sphereGeometry args={[0.18, 12, 12]} />
                    <meshBasicMaterial color="#d5faff" />
                  </mesh>
                  <pointLight
                    position={[0, 4.8, 0]}
                    intensity={5}
                    distance={6}
                    color="#8ed9ff"
                  />
                </group>
              ))}
            </group>
          ))}

          {[0, 1, 2, 3].map((i) => (
            <MovingDrone
              key={i}
              index={i}
              color={color}
            />
          ))}

          <mesh position={[1.7, 2.9, 4]}>
            <boxGeometry args={[0.1, 0.35, 1.7]} />
            <meshBasicMaterial
              color="#d4fff6"
              transparent
              opacity={0.8}
            />
          </mesh>
        </>
      )}

      <group ref={avatar}>
        <mesh position={[0, 1.25, 0]}>
          <capsuleGeometry args={[0.28, 0.85, 6, 12]} />
          <meshStandardMaterial color="#c3a8ff" />
        </mesh>
        <mesh position={[0, 2.02, 0]}>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#e6d9ff" />
        </mesh>
        <mesh position={[0, 1.35, -0.3]}>
          <boxGeometry args={[0.32, 0.15, 0.1]} />
          <meshBasicMaterial color="#7ff9e4" />
        </mesh>
      </group>
    </>
  );
}

export default function LivingCity({
  planet,
  onLeave,
}: {
  planet: PlanetData;
  onLeave: () => void;
}) {
  const [mode, setMode] = useState<ViewMode>("first");
  const [inside, setInside] = useState(false);
  const [nearDoor, setNearDoor] = useState(false);
  const [location, setLocation] = useState("0, 9");
  const keys = useRef<Set<string>>(new Set());
  const look = useRef({ yaw: 0, pitch: 0 });
  const dragging = useRef(false);
  const previous = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.classList.add("aethera-city-active");

    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
        event.preventDefault();
      }

      if (key === "v" && !event.repeat) {
        setMode((old) => old === "first" ? "third" : "first");
      }

      keys.current.add(key);
    };

    const up = (event: KeyboardEvent) => {
      keys.current.delete(event.key.toLowerCase());
    };

    const blur = () => keys.current.clear();

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);

    return () => {
      document.body.classList.remove("aethera-city-active");
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    previous.current = {
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    const dx = event.clientX - previous.current.x;
    const dy = event.clientY - previous.current.y;

    look.current.yaw += dx * 0.004;
    look.current.pitch = THREE.MathUtils.clamp(
      look.current.pitch - dy * 0.004,
      -1.15,
      1.15
    );

    previous.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "#090c20",
        color: "#f4ecff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        style={{
          position: "absolute",
          inset: 0,
          cursor: "grab",
          touchAction: "none",
        }}
      >
        <Canvas
          camera={{
            position: [0, 1.7, 9],
            fov: 72,
            near: 0.05,
            far: 160,
          }}
          dpr={[1, 1.5]}
        >
          <CityWorld
            planet={planet}
            mode={mode}
            inside={inside}
            onEnter={() => setInside(true)}
            onExit={() => setInside(false)}
            onNearby={setNearDoor}
            onPosition={setLocation}
            keys={keys}
            look={look}
          />
        </Canvas>
      </div>

      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          pointerEvents: "none",
          textShadow: "0 2px 12px #000",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            color: "#9de9e1",
          }}
        >
          AETHERA / LIVING CIVILIZATIONS
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(26px, 4vw, 45px)",
            margin: "8px 0",
          }}
        >
          {planet.title}
        </h1>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          {inside ? "INSIDE THE ARCHIVE" : "CITY STREETS"} · {mode.toUpperCase()} PERSON
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => setMode(mode === "first" ? "third" : "first")}
          style={buttonStyle}
        >
          SWITCH VIEW (V)
        </button>

        <button onClick={onLeave} style={buttonStyle}>
          ← RETURN TO SPACE
        </button>
      </div>

      {nearDoor && !inside && (
        <div style={promptStyle}>
          PRESS E TO ENTER THE ARCHIVE
          <button onClick={() => setInside(true)} style={buttonStyle}>
            ENTER
          </button>
        </div>
      )}

      <CityActivities planet={planet} inside={inside} />
      {inside && (
        <div style={promptStyle}>
          <div>THE ARCHIVE · {planet.content || "Your ideas live here."}</div>
          <button onClick={() => setInside(false)} style={buttonStyle}>
            EXIT BUILDING (E)
          </button>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 22,
          right: 22,
          display: "flex",
          justifyContent: "space-between",
          gap: 15,
          flexWrap: "wrap",
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "#c7c1dd",
          pointerEvents: "none",
          textShadow: "0 2px 10px #000",
        }}
      >
        <span>WASD WALK · SHIFT RUN · DRAG LOOK · V SWITCH VIEW · E INTERACT</span>
        <span>POSITION {location}</span>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "rgba(20,17,40,.92)",
  border: "1px solid rgba(200,180,255,.5)",
  borderRadius: 30,
  padding: "12px 17px",
  color: "#f6edff",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
} as const;

const promptStyle = {
  position: "absolute",
  left: "50%",
  bottom: 80,
  transform: "translateX(-50%)",
  background: "rgba(14,12,32,.94)",
  border: "1px solid rgba(180,160,255,.5)",
  borderRadius: 16,
  padding: "16px 22px",
  display: "flex",
  alignItems: "center",
  gap: 14,
  maxWidth: "85vw",
  fontSize: 12,
  zIndex: 20,
} as const;

