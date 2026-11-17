import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
  PLANET_COLORS,
  type PlanetData,
  type PlanetConnection,
} from "../../types/universe";

interface UniverseProps {
  planets: PlanetData[];
  connections: PlanetConnection[];
  selectedId: string | null;
  connectingFrom: string | null;
  onSelect: (id: string | null) => void;
  resetSignal: number;
}

function LivingPlanet({
  data,
  selected,
  connecting,
  onSelect,
}: {
  data: PlanetData;
  selected: boolean;
  connecting: boolean;
  onSelect: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);

  const color = PLANET_COLORS[data.category];
  const isCentral = data.id === "origin";
  const radius = isCentral ? 1.35 : 0.52;

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.12;

      const pulse =
        1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.018;

      mesh.current.scale.setScalar(pulse);
    }

    if (ring.current) {
      ring.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <group position={data.position}>
      <Float
        speed={1.2}
        rotationIntensity={0.08}
        floatIntensity={0.16}
      >
        <group>
          <mesh
            ref={mesh}
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[radius, 64, 64]} />
            <meshPhysicalMaterial
              color={color}
              metalness={0.25}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.12}
              emissive={color}
              emissiveIntensity={selected || connecting ? 0.85 : 0.4}
            />
          </mesh>

          <mesh scale={1.13}>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.09}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>

          <group ref={ring}>
            <mesh rotation={[Math.PI / 2.6, 0.2, 0]}>
              <torusGeometry
                args={[radius * 1.48, 0.008, 8, 128]}
              />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.85}
              />
            </mesh>

            {isCentral && (
              <mesh rotation={[Math.PI / 2.1, 0.8, 0]}>
                <torusGeometry
                  args={[radius * 1.8, 0.006, 8, 128]}
                />
                <meshBasicMaterial
                  color="#b9edff"
                  transparent
                  opacity={0.55}
                />
              </mesh>
            )}
          </group>

          {(selected || connecting) && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry
                args={[radius * 2.05, 0.012, 8, 128]}
              />
              <meshBasicMaterial
                color={connecting ? "#72e5ce" : "#ffffff"}
              />
            </mesh>
          )}
        </group>
      </Float>
    </group>
  );
}

function ConnectionLine({
  source,
  target,
  highlighted,
}: {
  source: PlanetData;
  target: PlanetData;
  highlighted: boolean;
}) {
  const material = useRef<THREE.MeshBasicMaterial>(null);

  const geometry = useMemo(() => {
    const start = new THREE.Vector3(...source.position);
    const end = new THREE.Vector3(...target.position);

    const middle = start.clone().add(end).multiplyScalar(0.5);
    middle.z -= 0.6;

    const curve = new THREE.QuadraticBezierCurve3(
      start,
      middle,
      end
    );

    return new THREE.TubeGeometry(curve, 64, 0.012, 6, false);
  }, [source.position, target.position]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state) => {
    if (material.current) {
      const pulse =
        0.48 + Math.sin(state.clock.elapsedTime * 1.8) * 0.16;

      material.current.opacity = highlighted
        ? Math.min(1, pulse + 0.3)
        : pulse;
    }
  });

  return (
    <mesh geometry={geometry} raycast={() => []}>
      <meshBasicMaterial
        ref={material}
        color={highlighted ? "#a6fff0" : "#b69aff"}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
}

function CameraRig({
  planets,
  selectedId,
  resetSignal,
}: {
  planets: PlanetData[];
  selectedId: string | null;
  resetSignal: number;
}) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const target = useRef(new THREE.Vector3());
  const destination = useRef(new THREE.Vector3(0, 0, 12));
  const moving = useRef(true);

  const selectedPlanet = planets.find(
    (planet) => planet.id === selectedId
  );

  const selectedPosition = selectedPlanet?.position;

  useEffect(() => {
    if (selectedPosition) {
      target.current.set(...selectedPosition);
      destination.current
        .copy(target.current)
        .add(new THREE.Vector3(0, 0.8, 4.5));
    } else {
      target.current.set(0, 0, 0);
      destination.current.set(0, 0, 12);
    }

    moving.current = true;
  }, [selectedId, selectedPosition, resetSignal]);

  useFrame((_, delta) => {
    if (!controls.current || !moving.current) return;

    const factor = 1 - Math.exp(-delta * 2.5);

    camera.position.lerp(destination.current, factor);
    controls.current.target.lerp(target.current, factor);
    controls.current.update();

    if (
      camera.position.distanceTo(destination.current) < 0.025 &&
      controls.current.target.distanceTo(target.current) < 0.025
    ) {
      moving.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan
      enableDamping
      dampingFactor={0.045}
      minDistance={1.8}
      maxDistance={35}
      autoRotate={!selectedId}
      autoRotateSpeed={0.18}
      onStart={() => {
        moving.current = false;
      }}
    />
  );
}

export default function Universe({
  planets,
  connections,
  selectedId,
  connectingFrom,
  onSelect,
  resetSignal,
}: UniverseProps) {
  const planetMap = useMemo(
    () => new Map(planets.map((planet) => [planet.id, planet])),
    [planets]
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => {
        if (!connectingFrom) onSelect(null);
      }}
    >
      <color attach="background" args={["#080713"]} />

      <ambientLight intensity={0.65} />

      <pointLight
        position={[5, 4, 5]}
        intensity={65}
        color="#a88bff"
      />

      <pointLight
        position={[-5, -3, 2]}
        intensity={40}
        color="#50e3d0"
      />

      <Stars
        radius={90}
        depth={50}
        count={3500}
        factor={4}
        saturation={0.4}
        fade
        speed={0.5}
      />

      {connections.map((connection) => {
        const source = planetMap.get(connection.sourceId);
        const target = planetMap.get(connection.targetId);

        if (!source || !target) return null;

        return (
          <ConnectionLine
            key={connection.id}
            source={source}
            target={target}
            highlighted={
              selectedId === source.id ||
              selectedId === target.id
            }
          />
        );
      })}

      {planets.map((planet) => (
        <LivingPlanet
          key={planet.id}
          data={planet}
          selected={selectedId === planet.id}
          connecting={connectingFrom === planet.id}
          onSelect={() => onSelect(planet.id)}
        />
      ))}

      <CameraRig
        planets={planets}
        selectedId={selectedId}
        resetSignal={resetSignal}
      />
    </Canvas>
  );
}

