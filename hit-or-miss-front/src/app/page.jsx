'use client';

import Spotify from "@/app/assets/spotify-icon.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const rooter = useRouter();

  const joinRoom = () => {
    rooter.push('/room');
  }
    
  return (
    <div className="h-[100dvh] w-[100dvw] flex items-center justify-center flex-col bg-gradient-to-t from-black to-slate-800">
      <h1 className="text-8xl font-bold mb-10">
        Hit or Miss
      </h1>
      <button onClick={joinRoom} className="bg-gradient-to-t from-green-400 to-green-600 hover:bg-green-600 text-white text-2xl p-2  rounded-md ml-2 w-1/6">
        Jouer
      </button>
      <Image 
        className="mt-10"
        src={Spotify}
        alt="Spotify logo"
        width={350}
        height={350} />
    </div>
  );
}
