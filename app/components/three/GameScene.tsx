"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useAppStore } from "../../lib/store";
import { audio } from "../../lib/audio";
import { palette3 } from "./palette3";

// Import portfolio landmarks to render as checkpoints
import { NeuralCore } from "./NeuralCore";
import { ProjectMonuments } from "./ProjectMonuments";
import { SkillConstellation } from "./SkillConstellation";
import { ArchiveRings } from "./ArchiveRings";

const LANES = [-2.2, 0, 2.2];
const HEIGHTS = [-0.4, 0.5, 1.4];
const COLLECTIBLE_NAMES = [
  "PYTHON", "TYPESCRIPT", "PYTORCH", "TENSORFLOW", "RAG",
  "ViT", "NEXT.JS", "AWS", "NLP", "LANGCHAIN", "DOCKER"
];

export function GameScene() {
  const { camera } = useThree();
  const quality = useAppStore((s) => s.quality);

  const shipRef = useRef<THREE.Group>(null);
  const entitiesGroupRef = useRef<THREE.Group>(null);
  const trackRef = useRef<THREE.Group>(null);

  // Landmark Refs for Checkpoints
  const coreGroup = useRef<THREE.Group>(null);
  const monGroup = useRef<THREE.Group>(null);
  const constGroup = useRef<THREE.Group>(null);
  const ringsGroup = useRef<THREE.Group>(null);

  // Gameplay variables stored in refs to prevent React updates at 60fps
  const shipPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector2(0, 0.5));
  const distance = useRef(0);
  const speed = useRef(18); // starts at 18m/s
  const lastSpawnDistance = useRef(0);
  const shakeTime = useRef(0);
  const nextCheckpoint = useRef(1); // 1: Core, 2: Missions, 3: Skill, 4: Rings

  // Keyboard controls state
  const keys = useRef({ left: false, right: false, up: false, down: false });

  // Pre-allocated array of active entities to avoid garbage collection (GC) allocations.
  // Slots 0-7: Obstacles, Slots 8-15: Collectibles.
  const activeEntities = useRef<
    Array<{
      active: boolean;
      type: "obstacle" | "collectible";
      name: string;
      x: number;
      y: number;
      z: number;
      speed: number;
      rotSpeed: THREE.Vector3;
    }>
  >([]);

  useEffect(() => {
    // Initialize entities slots
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        active: false,
        type: "obstacle" as const,
        name: "",
        x: 0,
        y: 0,
        z: -100,
        speed: 0,
        rotSpeed: new THREE.Vector3(0, 0, 0),
      });
    }
    for (let i = 0; i < 8; i++) {
      arr.push({
        active: false,
        type: "collectible" as const,
        name: "",
        x: 0,
        y: 0,
        z: -100,
        speed: 0,
        rotSpeed: new THREE.Vector3(0, 0, 0),
      });
    }
    activeEntities.current = arr;

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = useAppStore.getState().gameActive;
      if (!active) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.current.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.current.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.current.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Precompute track geometry to keep performance high
  const crossbars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push(i * -5);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const store = useAppStore.getState();
    const reduced = store.reducedMotion;

    if (!store.gameActive || store.gameShield <= 0) return;

    // 1. Advance gameplay distance & increase speed slightly over time
    distance.current += delta * speed.current;
    speed.current = Math.min(45, 18 + distance.current * 0.012);

    // 2. Input Handling & Ship Physics (blend keys and mouse)
    const keySteerX = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
    const keySteerY = (keys.current.up ? 1 : 0) - (keys.current.down ? 1 : 0);

    const mouseX = (state.pointer.x) * 3.3; // State.pointer holds instant pointer values
    const mouseY = (state.pointer.y) * 1.5 + 0.5;

    if (keySteerX !== 0 || keySteerY !== 0) {
      // Keyboard steering
      targetPos.current.x = THREE.MathUtils.clamp(targetPos.current.x + keySteerX * delta * 7.5, -3.0, 3.0);
      targetPos.current.y = THREE.MathUtils.clamp(targetPos.current.y + keySteerY * delta * 5.0, -0.9, 2.2);
    } else {
      // Mouse steering
      targetPos.current.x = THREE.MathUtils.clamp(mouseX, -3.0, 3.0);
      targetPos.current.y = THREE.MathUtils.clamp(mouseY, -0.9, 2.2);
    }

    // Smooth easing of ship towards target position
    const lerpK = reduced ? 1 : 1 - Math.exp(-delta * 10);
    shipPos.current.x += (targetPos.current.x - shipPos.current.x) * lerpK;
    shipPos.current.y += (targetPos.current.y - shipPos.current.y) * lerpK;

    if (shipRef.current) {
      shipRef.current.position.set(shipPos.current.x, shipPos.current.y, 0);

      // Add a dynamic bank/roll angle based on steering direction
      const rollTarget = -(targetPos.current.x - shipPos.current.x) * 0.28;
      shipRef.current.rotation.z += (rollTarget - shipRef.current.rotation.z) * 0.15;
      shipRef.current.rotation.x = (targetPos.current.y - shipPos.current.y) * 0.18;
    }

    // 3. Scroll Track Crossbars
    if (trackRef.current) {
      trackRef.current.position.z += delta * speed.current;
      if (trackRef.current.position.z >= 5) {
        trackRef.current.position.z = 0;
      }
    }

    // 4. Checkpoint Triggering & Landmark Movement
    const d = distance.current;

    // Checkpoint 1: Origin Core at 150m
    if (nextCheckpoint.current === 1 && d >= 150) {
      nextCheckpoint.current = 2;
      store.setGameScore((s) => s + 1000);
      audio.playCheckpoint();
      document.dispatchEvent(new CustomEvent("checkpoint-reached", { detail: "ORIGIN NEURAL CORE" }));
    }
    // Checkpoint 2: Missions Monuments at 400m
    if (nextCheckpoint.current === 2 && d >= 400) {
      nextCheckpoint.current = 3;
      store.setGameScore((s) => s + 1000);
      audio.playCheckpoint();
      document.dispatchEvent(new CustomEvent("checkpoint-reached", { detail: "MISSIONS ARCHIVE" }));
    }
    // Checkpoint 3: Skill Constellation at 700m
    if (nextCheckpoint.current === 3 && d >= 700) {
      nextCheckpoint.current = 4;
      store.setGameScore((s) => s + 1000);
      audio.playCheckpoint();
      document.dispatchEvent(new CustomEvent("checkpoint-reached", { detail: "SKILL CONSTELLATION" }));
    }
    // Checkpoint 4: Archive Rings at 1000m
    if (nextCheckpoint.current === 4 && d >= 1000) {
      nextCheckpoint.current = 5;
      store.setGameScore((s) => s + 1500);
      audio.playCheckpoint();
      document.dispatchEvent(new CustomEvent("checkpoint-reached", { detail: "ARCHIVE RING GATE" }));
    }

    // Landmark Drifting Animations
    // Neural Core (Origin) drifting on the Right
    if (d > 90 && d < 220) {
      if (coreGroup.current) {
        coreGroup.current.visible = true;
        coreGroup.current.position.z = -120 + (d - 90) * 1.5;
      }
    } else if (coreGroup.current) {
      coreGroup.current.visible = false;
    }

    // Project Monuments (Missions) drifting on the Left
    if (d > 330 && d < 470) {
      if (monGroup.current) {
        monGroup.current.visible = true;
        monGroup.current.position.z = -120 + (d - 330) * 1.5;
      }
    } else if (monGroup.current) {
      monGroup.current.visible = false;
    }

    // Skill Constellation drifting on the Right
    if (d > 620 && d < 780) {
      if (constGroup.current) {
        constGroup.current.visible = true;
        constGroup.current.position.z = -120 + (d - 620) * 1.5;
      }
    } else if (constGroup.current) {
      constGroup.current.visible = false;
    }

    // Archive Rings (Education) positioned right in the center (fly through)
    if (d > 910 && d < 1090) {
      if (ringsGroup.current) {
        ringsGroup.current.visible = true;
        ringsGroup.current.position.z = -120 + (d - 910) * 1.55;
      }
    } else if (ringsGroup.current) {
      ringsGroup.current.visible = false;
    }

    // 5. Spawning Obstacles & Collectibles
    // Spawn something every 24 meters
    if (d - lastSpawnDistance.current > 24) {
      lastSpawnDistance.current = d;
      
      const spawnType = Math.random() < 0.45 ? "obstacle" : "collectible";
      const lane = Math.floor(Math.random() * 3);
      const height = Math.floor(Math.random() * 3);
      
      // Find inactive slot of matching type
      const startIdx = spawnType === "obstacle" ? 0 : 8;
      const endIdx = spawnType === "obstacle" ? 8 : 16;
      let foundSlot = -1;
      for (let i = startIdx; i < endIdx; i++) {
        if (!activeEntities.current[i].active) {
          foundSlot = i;
          break;
        }
      }

      if (foundSlot !== -1) {
        const ent = activeEntities.current[foundSlot];
        ent.active = true;
        ent.x = LANES[lane];
        ent.y = HEIGHTS[height];
        ent.z = -80; // spawn far ahead
        ent.speed = speed.current + 8; // move faster than the highway speed
        ent.name = COLLECTIBLE_NAMES[Math.floor(Math.random() * COLLECTIBLE_NAMES.length)];
        ent.rotSpeed.set(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
      }
    }

    // 6. Update Entities Mesh Positions & Check Collisions
    activeEntities.current.forEach((ent, idx) => {
      const mesh = entitiesGroupRef.current?.children[idx];
      if (!mesh) return;

      if (!ent.active) {
        mesh.visible = false;
        return;
      }

      // Move toward player
      ent.z += delta * ent.speed;
      mesh.position.set(ent.x, ent.y, ent.z);

      // Spin
      mesh.rotation.x += ent.rotSpeed.x * delta;
      mesh.rotation.y += ent.rotSpeed.y * delta;

      mesh.visible = true;

      // Collision Check (AABB box style approximation)
      const distZ = Math.abs(ent.z - shipPos.current.z);
      if (distZ < 0.6) {
        const distX = Math.abs(ent.x - shipPos.current.x);
        const distY = Math.abs(ent.y - shipPos.current.y);

        if (distX < 0.85 && distY < 0.68) {
          // Deactivate
          ent.active = false;
          mesh.visible = false;

          if (ent.type === "obstacle") {
            // Collision with firewall
            audio.playHit();
            shakeTime.current = 0.38; // 0.38 seconds of shake
            store.setGameShield((s) => {
              const nextS = s - 20;
              if (nextS <= 0) {
                // Game Over - set high score if relevant
                const currentScore = store.gameScore;
                if (currentScore > store.highScore) {
                  store.setHighScore(currentScore);
                }
              }
              return nextS;
            });
          } else {
            // Collected a data node
            audio.playCollect();
            store.setGameScore((s) => s + 100);
            store.setGameCollectibles((s) => s + 1);
            document.dispatchEvent(new CustomEvent("node-collected", { detail: ent.name }));
          }
        }
      }

      // Out of bounds cleanup
      if (ent.z > 8) {
        ent.active = false;
        mesh.visible = false;
      }
    });

    // 7. Camera Following & Screen Shake
    let targetCamX = shipPos.current.x * 0.65;
    let targetCamY = shipPos.current.y * 0.5 + 1.25;
    let targetCamZ = 4.8;

    // FOV expands as speed increases to create speed warp illusion
    if ("fov" in camera) {
      const persCam = camera as THREE.PerspectiveCamera;
      persCam.fov = 42 + (speed.current - 18) * 0.4;
      persCam.updateProjectionMatrix();
    }

    if (shakeTime.current > 0) {
      shakeTime.current -= delta;
      const shakeIntensity = shakeTime.current * 0.45;
      targetCamX += (Math.random() - 0.5) * shakeIntensity;
      targetCamY += (Math.random() - 0.5) * shakeIntensity;
    }

    camera.position.set(
      camera.position.x + (targetCamX - camera.position.x) * 0.15,
      camera.position.y + (targetCamY - camera.position.y) * 0.15,
      camera.position.z + (targetCamZ - camera.position.z) * 0.15
    );
    
    // Camera looks slightly ahead of the ship
    camera.lookAt(new THREE.Vector3(shipPos.current.x * 0.4, shipPos.current.y * 0.4, -6.5));
  });

  return (
    <>
      {/* Dynamic Lighting parked with the glider */}
      <pointLight
        position={[shipPos.current.x, shipPos.current.y + 0.8, -1]}
        intensity={3.5}
        distance={9}
        color={palette3.primary}
      />

      {/* Cyber Glider Ship Model */}
      <group ref={shipRef}>
        {/* Sleek procedural spaceship */}
        {/* Nose Cone */}
        <mesh position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.24, 0.9, 6]} />
          <meshStandardMaterial
            color={palette3.primary}
            emissive={palette3.primary}
            emissiveIntensity={0.5}
            flatShading
          />
        </mesh>
        {/* Core fuselage */}
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[0.28, 0.18, 0.7]} />
          <meshStandardMaterial
            color={palette3.fg}
            roughness={0.25}
            metalness={0.2}
            flatShading
          />
        </mesh>
        {/* Delta Wings */}
        <mesh position={[0, -0.04, 0.2]}>
          <boxGeometry args={[1.05, 0.05, 0.42]} />
          <meshStandardMaterial
            color={palette3.accent}
            emissive={palette3.accent}
            emissiveIntensity={0.4}
            flatShading
          />
        </mesh>
        {/* Glowing Engine Thruster trail */}
        <mesh position={[0, 0, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.08, 0.35, 4]} />
          <meshBasicMaterial color={palette3.accent} />
        </mesh>
      </group>

      {/* Scrolling Highway Track */}
      <group ref={trackRef}>
        {/* Side neon rails */}
        <mesh position={[-3.3, -1.2, -50]}>
          <boxGeometry args={[0.05, 0.05, 100]} />
          <meshBasicMaterial color={palette3.primary} transparent opacity={0.35} />
        </mesh>
        <mesh position={[3.3, -1.2, -50]}>
          <boxGeometry args={[0.05, 0.05, 100]} />
          <meshBasicMaterial color={palette3.primary} transparent opacity={0.35} />
        </mesh>

        {/* Crossbars indicating speed */}
        {crossbars.map((z, idx) => (
          <mesh key={idx} position={[0, -1.2, z]}>
            <boxGeometry args={[6.6, 0.015, 0.04]} />
            <meshBasicMaterial color={palette3.primary} transparent opacity={0.2} />
          </mesh>
        ))}
      </group>

      {/* Spooled Entities Group (8 Obstacles + 8 Collectibles) */}
      <group ref={entitiesGroupRef}>
        {/* 8 Obstacles: Red firewalls */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <mesh key={`obs-${idx}`} visible={false}>
            <boxGeometry args={[0.75, 0.75, 0.75]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.8}
              flatShading
            />
          </mesh>
        ))}

        {/* 8 Collectibles: Accent colored database nodes */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <group key={`col-${idx}`} visible={false}>
            {/* Core Gem */}
            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
              <octahedronGeometry args={[0.32]} />
              <meshStandardMaterial
                color={palette3.accent}
                emissive={palette3.accent}
                emissiveIntensity={0.9}
                flatShading
              />
            </mesh>
            {/* Spinning orbit ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.48, 0.02, 6, 24]} />
              <meshBasicMaterial color={palette3.primary} transparent opacity={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Checkpoint Landmarks (scroll past dynamically on checkpoints) */}
      {/* 1. Neural Core (Right side) */}
      <group ref={coreGroup} visible={false} position={[4.6, 0.3, -120]}>
        <NeuralCore quality={quality} />
      </group>

      {/* 2. Project Monuments (Left side) */}
      <group ref={monGroup} visible={false} position={[-4.5, 0.2, -120]} rotation={[0, Math.PI / 4, 0]}>
        <ProjectMonuments />
      </group>

      {/* 3. Skill Constellation (Right side) */}
      <group ref={constGroup} visible={false} position={[4.0, 1.2, -120]}>
        <SkillConstellation />
      </group>

      {/* 4. Archive Rings (Centered - player flies directly through!) */}
      <group ref={ringsGroup} visible={false} position={[0, 0.5, -120]}>
        <ArchiveRings />
      </group>
    </>
  );
}
