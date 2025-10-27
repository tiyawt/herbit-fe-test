"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const SEEN_KEY = "gc_seenSplash_v2";

export default function SplashRoot() {
  const router = useRouter();
  const [i, setI] = useState(0);

  const slides = [
    {
      img: "/splashScreen/1.jpg",
      title: "Bingung Sampah Organik Rumah Tangga Mau Diapain?",
      desc: "Sisa dapur bukan sekadar sampah. Kita bisa ubah jadi ecoenzim bermanfaat.",
    },
    {
      img: "/splashScreen/2.jpg",
      title: "Setiap Aksi Kecilmu Sangat Berarti",
      desc: "Dari tantangan sederhana lahir perubahan besar. Selesaikan misi, kumpulkan poin!",
    },
    {
      img: "/splashScreen/3.jpg",
      title: "Siap Jadi Eco Warrior?",
      desc: "Ribuan perempuan sudah mulai. Giliran kamu mulai hari ini.",
    },
  ];

  const finish = () => {
    localStorage.setItem(SEEN_KEY, "1");
    router.replace("/login");
  };

  const handleNext = () => {
    if (i < slides.length - 1) setI(i + 1);
    else finish();
  };

  const handleSkip = () => finish();

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-white flex flex-col items-center justify-between">
      {/* Bagian atas - gambar */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <div className="w-full max-w-[480px] aspect-[16/11] relative">
          <Image
            src={slides[i].img}
            alt=""
            fill
            sizes="(max-width:640px) 90vw, 480px"
            className="object-contain select-none pointer-events-none"
            priority
          />
        </div>
      </div>

      {/* Bagian bawah - teks + tombol */}
      <div className="w-full max-w-[620px] text-center pb-10 px-6">
        <h2 className="text-xl sm:text-2xl font-semibold">{slides[i].title}</h2>
        <p className="mt-2 text-sm text-gray-600">{slides[i].desc}</p>

        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-gray-900" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between w-full px-4 mt-6">
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
          >
            Skip
          </button>

          <button
            onClick={handleNext}
            className="
    relative flex items-center justify-center
    w-12 h-12 rounded-full
    border-2 border-[#FDBE45] bg-[#FFD369]
    outline-[3px] outline-[#FDBE45]/50
    hover:bg-[#ffc632] transition
  "
          >
            <ChevronRight size={18} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
