"use client";

import { useEffect, useState } from "react";
import { challengesData } from "./listChallenge";


// Daftar semua challenge yang tersedia
const ALL_CHALLENGES = challengesData;

export default function DailyChallenge({ onChallengeComplete, onChallengeUncomplete }) {
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);

  // Fungsi untuk mengacak dan memilih 5 challenge
  const generateDailyChallenges = () => {
    const shuffled = [...ALL_CHALLENGES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 40).map((c) => ({ ...c, completed: false }));
    return selected;
  };

  // Cek apakah hari sudah berganti
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  useEffect(() => {
    const todayKey = getTodayKey();
    const savedDate = localStorage.getItem("challengeDate");
    const savedChallenges = localStorage.getItem("dailyChallenges");
    const savedCompleted = localStorage.getItem("completedToday");

    // Jika hari berbeda, generate challenge baru
    if (savedDate !== todayKey) {
      const newChallenges = generateDailyChallenges();
      setDailyChallenges(newChallenges);
      setCompletedToday(0);
      localStorage.setItem("challengeDate", todayKey);
      localStorage.setItem("dailyChallenges", JSON.stringify(newChallenges));
      localStorage.setItem("completedToday", "0");
    } else {
      // Load challenge yang tersimpan
      if (savedChallenges) {
        setDailyChallenges(JSON.parse(savedChallenges));
      }
      if (savedCompleted) {
        setCompletedToday(parseInt(savedCompleted));
      }
    }
  }, []);

  // ✅ Logika checkbox (handleCheckChallenge)
  const handleCheckChallenge = (challengeId) => {
    setDailyChallenges((prev) => {
      const updated = prev.map((c) =>
        c.id === challengeId ? { ...c, completed: !c.completed } : c
      );

      const targetChallenge = prev.find((c) => c.id === challengeId);
      const wasCompleted = targetChallenge?.completed ?? false;
      const completedCount = updated.filter((c) => c.completed).length;

      setCompletedToday(completedCount);
      localStorage.setItem("dailyChallenges", JSON.stringify(updated));
      localStorage.setItem("completedToday", completedCount.toString());

      // Callback sesuai aksi user
      if (!wasCompleted) {
        onChallengeComplete();
      } else {
        onChallengeUncomplete();
      }

      return updated;
    });
  };

  const progressPercentage = (completedToday / 5) * 100;

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">🎯 Challenge Harian</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Progress Hari Ini</p>
          <p className="text-2xl font-bold text-green-600">{completedToday}/5</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Challenge List */}
      <div className="space-y-3">
        {dailyChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`flex items-start p-4 rounded-lg border-2 transition-all duration-300 ${
              challenge.completed
                ? "bg-green-50 border-green-400 shadow-sm"
                : "bg-white border-gray-200 hover:border-green-300"
            }`}
          >
            <input
              type="checkbox"
              checked={challenge.completed}
              onChange={() => handleCheckChallenge(challenge.id)}
              className="w-5 h-5 mt-0.5 mr-3 cursor-pointer accent-green-600"
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  challenge.completed ? "line-through text-gray-500" : "text-gray-800"
                }`}
              >
                {challenge.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <p className="text-sm text-gray-700 text-center">
          {completedToday === 0 && "🌱 Mulai hari dengan 1 challenge kecil!"}
          {completedToday > 0 && completedToday < 3 && "💪 Bagus! Teruskan momentum ini!"}
          {completedToday >= 3 && completedToday < 5 && "🔥 Hebat! Tinggal sedikit lagi!"}
          {completedToday === 5 && "🎉 Sempurna! Semua challenge hari ini selesai!"}
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        💡 Challenge akan direset otomatis setiap hari
      </p>
    </div>
  );
}
