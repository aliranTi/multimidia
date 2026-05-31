"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPauseCircle, FaPlayCircle, FaStepBackward, FaStepForward } from "react-icons/fa";


const playlist = [
  { id: 0, title: "Good For You - Selena Gomez.mp3", src: "data/musics/Good For You - Selena Gomez.mp3" },
  { id: 1, title: "Medo Bobo - Rubel", src: "data/musics/Medo Bobo - Rubel.mp3" },
  { id: 2, title: "No. 1 Party Anthem - Arctic Monkeys", src: "data/musics/No. 1 Party Anthem - Arctic Monkeys.mp3" },
  { id: 3, title: "Sailor Song - gigi", src: "data/musics/Sailor Song - gigi.mp3" },
  { id: 4, title: "Swim - Chase Atlantic", src: "data/musics/Swim - Chase Atlantic.mp3" }
];

export default function Home() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      nextTrack();
    };
  }, [audioIndex, playing]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.trunc(time / 60);
    const seconds = Math.trunc(time % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }


  const nextTrack = () => {
    setAudioIndex((prev) => (prev + 1) % playlist.length);
    setPlaying(true);
  }

  const prevTrack = () => {
    setAudioIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setPlaying(true);
  }

  const selectTrack = (index: number) => {
    setAudioIndex(index);
    setPlaying(true);
  }


  const configVolume = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value;
    setVolume(value);
  }


  const configCurrentTime = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }


  const skipTime = (amount: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    let newTime = audio.currentTime + amount;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    configCurrentTime(newTime);
  }

  return (
    <div className="flex flex-col items-center w-full max-full justify-center  p-5 bg-gray-900">
      <div className="flex flex-col bg-purple-500 w-full max-w-md p-6 items-center justify-center rounded-3xl shadow-xl">
        
        <div className="w-full mb-6 bg-white/20 rounded-xl p-3 shadow-inner">
          <h3 className="text-white font-bold text-center mb-3">Lista de Reprodução</h3>
          <ul className="space-y-2">
            {playlist.map((track, index) => (
              <li 
                key={track.id} 
                onClick={() => selectTrack(index)}
                className={`cursor-pointer p-2 rounded-lg text-center transition-colors ${
                  index === audioIndex 
                    ? 'bg-purple-700 text-white font-bold shadow-md'
                    : 'text-purple-100 hover:bg-purple-600'
                }`}
              >
                {track.title} {index === audioIndex && (playing ? " 🎵" : " ⏸️")}
              </li>
            ))}
          </ul>
        </div>

        <audio ref={audioRef} src={playlist[audioIndex].src} hidden></audio>
        

        <div className="flex items-center gap-6 mb-6 text-3xl text-white">
          <button onClick={prevTrack} className="hover:text-purple-300 transition-colors" title="Faixa Anterior">
            <FaStepBackward />
          </button>
          
          <button onClick={() => skipTime(-10)} className="text-xl hover:text-purple-300 transition-colors" title="Retroceder 10s">
            <FaBackward />
          </button>

          <button onClick={playPause} className="text-6xl hover:scale-105 transition-transform drop-shadow-md">
            {playing ? <FaPauseCircle /> : <FaPlayCircle />}
          </button>

          <button onClick={() => skipTime(10)} className="text-xl hover:text-purple-300 transition-colors" title="Avançar 10s">
             <FaForward />
          </button>

          <button onClick={nextTrack} className="hover:text-purple-300 transition-colors" title="Próxima Faixa">
            <FaStepForward />
          </button>
        </div>


        <div className="flex w-full items-center gap-3 mb-5 text-white text-sm font-medium">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input 
            type="range"
            className="flex-1 accent-purple-800 h-2 cursor-pointer"
            min={0}
            step={0.001}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>


        <div className="flex w-full items-center gap-3 text-white text-sm font-medium">
          <span className="w-16">Volume</span>
          <input type="range"
            className="flex-1 accent-purple-800 h-2 cursor-pointer"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => configVolume(Number(e.target.value))}
          />
          <span className="w-10 text-right">{Math.round(volume * 100)}%</span>
        </div>
        
      </div>
    </div>
  );
}