"use client";
import { getDailyTasks } from "@/lib/dailytracker";
import { useEffect, useState } from "react";

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyTasks()
      .then((res) => {
        setTasks(res.data.tasks || []);
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading daily tasks...</p>;

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Daily Tasks</h1>
      
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                margin: "1rem 0",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "10px",
              }}
            >
              <h3>{task.title}</h3>
            </li>
          ))}
        </ul>
      
    </main>
  );
}
