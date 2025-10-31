"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getChecklists } from "@/lib/dailytracker";

export default function Tree() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data checklist untuk tau daun mana yang aktif
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getChecklists(); // endpoint: /checklists
      const tasks = res.data.tasks || [];

      // Ambil hanya yang punya treeLeafId (artinya sudah punya daun)
      const leafData = tasks
        .filter((task) => task.treeLeafId)
        .map((task) => ({
          id: task.treeLeafId,
          isCompleted: task.isCompleted,
        }));

      setLeaves(leafData);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading tree...</p>;

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
        padding: "2rem",
      }}
    >
      <h1>🌳 My Tree</h1>

      <div
        style={{
          position: "relative",
          width: "300px",
          height: "400px",
          backgroundImage: "url('/tree-base.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Render daun */}
        {leaves.map((leaf, i) => (
          <Image
            key={leaf.id}
            src={leaf.isCompleted ? "/tree-assets/daun-hijau.png" : "/tree-assets/daun-kuning.png"}
            alt="leaf"
            width={40}
            height={40}
            style={{
              position: "absolute",
              top: 80 + (i % 3) * 60,
              left: 100 + (i * 30) % 100,
              transition: "transform 0.3s ease",
            }}
          />
        ))}
      </div>

      <button
        onClick={fetchLeaves}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#4CAF50",
          color: "white",
          cursor: "pointer",
        }}
      >
        🔄 Refresh Tree
      </button>
    </main>
  );
}
