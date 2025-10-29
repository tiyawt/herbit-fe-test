"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { leafPositions } from "./leaf-positios";
import DailyChallenge from "./dailyChallenge";
// 

// import { leafPositions } from "./leaf-positions";
// import DailyChallenge from "./dailyChallenge";

export default function TreeTracker({
  onAddHabit,
  onChallengeComplete,
  onChallengeUncomplete,
}) {
  const [leafCount, setLeafCount] = useState(0);
  const [leafColors, setLeafColors] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [harvestedIds, setHarvestedIds] = useState([]);
  const [harvestedTimestamps, setHarvestedTimestamps] = useState({});
  const [points, setPoints] = useState(0);
  const [harvestingFruitId, setHarvestingFruitId] = useState(null);
  const [showPointGain, setShowPointGain] = useState(false);
  const pointRef = useRef(null);
  const lastHabitTime = useRef(Date.now());

  // === LOAD LOCALSTORAGE ===
  useEffect(() => {
    const savedLeaves = parseInt(localStorage.getItem("treeLeaves") || "0");
    const savedFruits = JSON.parse(localStorage.getItem("treeFruits") || "[]");
    const savedHarvested = JSON.parse(localStorage.getItem("treeHarvested") || "[]");
    const savedHarvestedTimestamps = JSON.parse(localStorage.getItem("treeHarvestedTimestamps") || "{}");
    const savedPoints = parseInt(localStorage.getItem("treePoints") || "0");
    const savedColors = JSON.parse(localStorage.getItem("treeLeafColors") || "[]");

    setLeafCount(savedLeaves);
    setFruits(savedFruits);
    setHarvestedIds(savedHarvested);
    setHarvestedTimestamps(savedHarvestedTimestamps);
    setPoints(savedPoints);
    if (savedColors.length) {
      setLeafColors(savedColors);
    } else {
      setLeafColors(Array(savedLeaves).fill("green"));
    }
  }, []);

  // === SIMPAN LOCALSTORAGE ===
  useEffect(() => {
    localStorage.setItem("treeLeaves", leafCount.toString());
    localStorage.setItem("treeFruits", JSON.stringify(fruits));
    localStorage.setItem("treeHarvested", JSON.stringify(harvestedIds));
    localStorage.setItem("treeHarvestedTimestamps", JSON.stringify(harvestedTimestamps));
    localStorage.setItem("treePoints", points.toString());
    localStorage.setItem("treeLeafColors", JSON.stringify(leafColors));
  }, [leafCount, fruits, harvestedIds, harvestedTimestamps, points, leafColors]);

  // === TAMBAH HABIT ===
  const handleAddHabit = () => {
    lastHabitTime.current = Date.now();

    const idxKuning = leafColors.findIndex((color) => color === "yellow");
    if (idxKuning !== -1) {
      const updated = [...leafColors];
      updated[idxKuning] = "green";
      setLeafColors(updated);
      onChallengeComplete?.();
      return;
    }

    const newLeafCount = leafCount + 1;
    const newLeafColors = [...leafColors, "green"];
    let newFruits = [...fruits];

    if (newLeafCount > 3 && (newLeafCount - 3) % 2 === 0) {
      const index = Math.floor((newLeafCount - 4) / 2) % leafPositions.length;
      const pos = leafPositions[index];
      const newFruit = {
        id: `fruit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        x: pos.x,
        y: pos.y,
        createdAt: Date.now(),
      };
      newFruits = [...newFruits, newFruit];
    }

    setLeafCount(newLeafCount);
    setLeafColors(newLeafColors);
    setFruits(newFruits);
    onAddHabit?.();
    onChallengeComplete?.();
  };

  // === BATALKAN HABIT TERAKHIR ===
  const handleCancelHabit = () => {
    if (leafCount === 0 && leafColors.length === 0) return;
    const idxHijau = leafColors.findLastIndex((color) => color === "green");

    if (idxHijau !== -1 && leafColors.includes("yellow")) {
      const updated = [...leafColors];
      updated[idxHijau] = "yellow";
      setLeafColors(updated);
      onChallengeUncomplete?.();
      return;
    }

    const updatedLeaves = [...leafColors];
    updatedLeaves.pop();

    let updatedFruits = [...fruits];
    let updatedPoints = points;

    if (leafCount > 3 && (leafCount - 3) % 2 === 0 && fruits.length > 0) {
      const lastFruit = fruits[fruits.length - 1];
      if (harvestedIds.includes(lastFruit.id)) {
        updatedPoints = Math.max(0, updatedPoints - 5);
        const newHarvested = harvestedIds.filter((id) => id !== lastFruit.id);
        const newHarvestedTimestamps = { ...harvestedTimestamps };
        delete newHarvestedTimestamps[lastFruit.id];
        setHarvestedIds(newHarvested);
        setHarvestedTimestamps(newHarvestedTimestamps);
      }
      updatedFruits.pop();
    }

    setPoints(updatedPoints);
    setLeafCount((prev) => Math.max(0, prev - 1));
    setLeafColors(updatedLeaves);
    setFruits(updatedFruits);
    onChallengeUncomplete?.();
  };

  // === PANEN BUAH ===
  const handleHarvestFruit = (id) => {
    if (harvestedIds.includes(id) || harvestingFruitId === id) return;

    const fruit = fruits.find((f) => f.id === id);
    if (!fruit) return;

    const now = Date.now();
    const age = now - fruit.createdAt;

    if (age < 10000) {
      alert("Ups, buah yang ini belum matang! Tunggu besok ya.");
      return;
    }

    setHarvestingFruitId(id);

    setTimeout(() => {
      const harvestedAt = Date.now();
      const updatedHarvested = [...harvestedIds, id];
      const updatedHarvestedTimestamps = { ...harvestedTimestamps, [id]: harvestedAt };

      setHarvestedIds(updatedHarvested);
      setHarvestedTimestamps(updatedHarvestedTimestamps);
      setFruits((prev) => prev.filter((f) => f.id !== id));
      setPoints((prev) => prev + 10);
      setHarvestingFruitId(null);

      setShowPointGain(true);
      setTimeout(() => setShowPointGain(false), 1000);
    }, 900);
  };

  // === AUTO KUNING ===
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastHabitTime.current;
      if (idleTime >= 10000 && leafColors.includes("green")) {
        const idx = leafColors.findIndex((color) => color === "green");
        if (idx !== -1) {
          const updated = [...leafColors];
          updated[idx] = "yellow";
          setLeafColors(updated);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [leafColors]);

  // === RENDER ===
  return (
    <div className="relative w-full bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
      <h2 className="text-xl font-bold text-green-700 mb-4">🌳 Tree Tracker</h2>

      <DailyChallenge
        onChallengeComplete={handleAddHabit}
        onChallengeUncomplete={handleCancelHabit}
      />

      <div className="flex items-center justify-between mb-4 relative">
        <div ref={pointRef} className="relative text-sm text-gray-700 font-semibold">
          Poin: <span className="text-green-600 font-bold">{points}</span>
          <AnimatePresence>
            {showPointGain && (
              <motion.span
                key="plus10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8 }}
                className="absolute left-6 text-green-500 text-base font-bold"
              >
                +10
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-lg">
        <div className="relative w-full md:max-w-xs h-100 flex items-center justify-center bg-green-100">
          <Image src="/tree-assets/pohon.png" alt="Pohon" fill className="w-full h-auto object-contain" priority />

          {leafColors.map((color, index) => {
            const pos = leafPositions[index % leafPositions.length];
            const rotation = (index * 37 + 15) % 360;
            const size = 18 + (index * 13) % 10;

            return (
              <motion.div
                key={`leaf-${index}`}
                className="absolute"
                style={{
                  left: `${(pos.x - 7) * 1.1}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
                initial={{ opacity: 0, scale: 0.3, rotate: rotation - 45 }}
                animate={{ opacity: 1, scale: 1, rotate: rotation }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <Image
                  src={color === "green" ? "/tree-assets/daun-hijau.png" : "/tree-assets/daun-kuning.png"}
                  alt={color === "green" ? "Daun Hijau" : "Daun Kuning"}
                  width={size}
                  height={size}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </motion.div>
            );
          })}

          <AnimatePresence>
            {fruits.map((fruit) => (
              <motion.div
                key={fruit.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${fruit.x}%`,
                  top: `${fruit.y}%`,
                }}
                onClick={() => handleHarvestFruit(fruit.id)}
                animate={{
                  scale: [1, 1.05, 1],
                  y: [0, -2, 0],
                  opacity: 1,
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2,
                  ease: "easeInOut",
                }}
                exit={{
                  scale: 0,
                  opacity: 0,
                  transition: { duration: 0.3 },
                }}
              >
                <Image src="/tree-assets/buah.png" alt="Buah" width={22} height={22} style={{ opacity: 1 }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Tambahkan habit untuk menumbuhkan daun 🌱 <br />
          Jika tidak menambah habit, daun akan menguning setiap 10 detik 🍂
        </p>
      </div>
    </div>
  );
}
