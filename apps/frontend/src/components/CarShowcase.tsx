"use client";

import React, { Suspense, useState, useRef, useEffect, useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  useProgress,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

import { CarModelData, CarShowcaseProps } from "../types/car";
import { DEFAULT_CAR_MODELS, COLOR_PRESETS } from "../constants/showcase";

export type { CarModelData, CarShowcaseProps };
export { DEFAULT_CAR_MODELS, COLOR_PRESETS };

export const CAR_MODELS = DEFAULT_CAR_MODELS;

DEFAULT_CAR_MODELS.forEach((car) => {
  try {
    useGLTF.preload(car.modelPath);
  } catch (err) {
  }
});

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 text-white shadow-2xl min-w-[220px]">
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <span className="text-xs font-semibold text-emerald-400">
            {progress.toFixed(0)}%
          </span>
        </div>
        <p className="text-xs font-medium tracking-widest uppercase text-neutral-400 animate-pulse">
          3D Model Yükleniyor...
        </p>
      </div>
    </Html>
  );
}

interface CarMeshProps {
  modelPath: string;
  customColor: string;
}

function CarMesh({ modelPath, customColor }: CarMeshProps) {
  const { scene } = useGLTF(modelPath);
  const { invalidate } = useThree();

  useLayoutEffect(() => {
    if (!scene) return;

    scene.scale.set(1, 1, 1);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3();
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.visible) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          if (!mesh.geometry.boundingBox) {
            mesh.geometry.computeBoundingBox();
          }
          const meshBox = mesh.geometry.boundingBox?.clone();
          if (meshBox) {
            meshBox.applyMatrix4(mesh.matrixWorld);
            box.union(meshBox);
          }
        }
      }
    });

    if (!box.isEmpty()) {
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);

      if (maxDim > 0 && isFinite(maxDim)) {
        const targetScale = 4.5 / maxDim;
        scene.scale.setScalar(targetScale);
      }
    }

    invalidate();
  }, [scene, modelPath, invalidate]);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.material) return;

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((mat) => {
          if (!mat) return;
          const matName = (mat.name || "").toLowerCase();
          const meshName = (mesh.name || "").toLowerCase();

          const isGlass =
            mat.transparent ||
            mat.opacity < 0.95 ||
            matName.includes("glass") ||
            matName.includes("window") ||
            meshName.includes("glass") ||
            meshName.includes("window");

          const isTireOrRubber =
            matName.includes("tire") ||
            matName.includes("rubber") ||
            matName.includes("wheel_rubber") ||
            meshName.includes("tire");

          const isBodyPaint =
            !isGlass &&
            !isTireOrRubber &&
            (matName.includes("body") ||
              matName.includes("paint") ||
              matName.includes("car_body") ||
              matName.includes("carbody") ||
              matName.includes("exterior") ||
              matName.includes("color") ||
              matName.includes("primary") ||
              meshName.includes("body") ||
              meshName.includes("door") ||
              meshName.includes("hood") ||
              meshName.includes("fender"));

          if (customColor === "ORIGINAL") {
            if ((mat as any)._originalColor) {
              (mat as THREE.MeshStandardMaterial).color.copy(
                (mat as any)._originalColor
              );
            }
          } else if (isBodyPaint || (!isGlass && !isTireOrRubber)) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            if (stdMat.color) {
              if (!(mat as any)._originalColor) {
                (mat as any)._originalColor = stdMat.color.clone();
              }
              stdMat.color.set(customColor);
            }
          }
        });
      }
    });

    invalidate();
  }, [scene, customColor, invalidate]);

  return (
    <Center top>
      <primitive object={scene} />
    </Center>
  );
}

export default function CarShowcase({
  models = DEFAULT_CAR_MODELS,
  initialCarId,
  className = "h-[85vh] min-h-[600px]",
}: CarShowcaseProps) {
  const carList = models.length > 0 ? models : DEFAULT_CAR_MODELS;
  const [selectedCarId, setSelectedCarId] = useState<string>(
    initialCarId || carList[0]?.id || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>("ORIGINAL");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"models" | "colors" | "specs">(
    "models"
  );

  const controlsRef = useRef<any>(null);
  const currentCar =
    carList.find((c) => c.id === selectedCarId) || carList[0];

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div
      className={`relative w-full bg-neutral-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between select-none ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 p-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-b from-neutral-950/90 to-transparent backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              {currentCar?.brand}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {currentCar?.year} • {currentCar?.category}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {currentCar?.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all flex items-center gap-2 ${autoRotate
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10"
              : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${autoRotate ? "bg-emerald-400 animate-ping" : "bg-neutral-500"
                }`}
            />
            Otomatik Döndürme: {autoRotate ? "Açık" : "Kapalı"}
          </button>

          <button
            onClick={handleResetCamera}
            className="px-4 py-2 text-xs font-medium bg-white/5 border border-white/10 rounded-xl text-neutral-300 hover:bg-white/10 transition-colors"
          >
            Kamerayı Sıfırla
          </button>
        </div>
      </div>

      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          camera={{ position: [4.5, 2, 5.5], fov: 40 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
          }}
        >
          <color attach="background" args={["#0a0a0a"]} />

          <Suspense fallback={<CanvasLoader />}>
            <Environment preset="city" environmentIntensity={0.6} />

            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              castShadow={false}
            />

            {currentCar && (
              <CarMesh
                key={selectedCarId}
                modelPath={currentCar.modelPath}
                customColor={selectedColor}
              />
            )}

            <ContactShadows
              position={[0, -0.01, 0]}
              opacity={0.75}
              scale={12}
              blur={1.5}
              far={4}
              resolution={512}
              color="#000000"
            />

            <OrbitControls
              ref={controlsRef}
              makeDefault
              target={[0, 0.7, 0]}
              enableDamping={true}
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.05}
              minDistance={3}
              maxDistance={12}
              autoRotate={autoRotate}
              autoRotateSpeed={1.2}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 p-6 bg-gradient-to-t from-neutral-950/95 via-neutral-950/80 to-transparent backdrop-blur-md border-t border-white/10">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("models")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "models"
              ? "bg-white text-black shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Model Seçimi ({carList.length})
          </button>
          <button
            onClick={() => setActiveTab("colors")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "colors"
              ? "bg-white text-black shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Renk Özelleştirme
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === "specs"
              ? "bg-white text-black shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Teknik Özellikler
          </button>
        </div>

        {activeTab === "models" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 py-1">
            {carList.map((car) => {
              const isSelected = car.id === selectedCarId;
              return (
                <button
                  key={car.id}
                  onClick={() => {
                    setSelectedCarId(car.id);
                    setSelectedColor("ORIGINAL");
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${isSelected
                    ? "bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                    {car.brand}
                  </p>
                  <p className="text-xs font-bold truncate text-white">
                    {car.name}
                  </p>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    {car.year}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "colors" && (
          <div className="flex flex-wrap items-center gap-3 py-1">
            {COLOR_PRESETS.map((color) => {
              const isSelected = selectedColor === color.hex;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${isSelected
                    ? "bg-white/20 border-white text-white font-medium ring-2 ring-emerald-500/50"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
                    }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-inner flex items-center justify-center text-[8px]"
                    style={{
                      backgroundColor:
                        color.hex === "ORIGINAL" ? "#64748b" : color.hex,
                    }}
                  >
                    {color.hex === "ORIGINAL" && "★"}
                  </span>
                  <span>{color.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "specs" && currentCar && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-1">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase font-mono">
                Motor
              </span>
              <p className="text-sm font-semibold text-white truncate">
                {currentCar.specs.engine}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase font-mono">
                Güç
              </span>
              <p className="text-sm font-semibold text-emerald-400">
                {currentCar.specs.hp} HP
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase font-mono">
                0 - 100 km/s
              </span>
              <p className="text-sm font-semibold text-white">
                {currentCar.specs.zeroToHundred}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] text-neutral-400 uppercase font-mono">
                Maksimum Hız
              </span>
              <p className="text-sm font-semibold text-white">
                {currentCar.specs.topSpeed}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
