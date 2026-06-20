"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPauseCircle, FaPlayCircle, FaStepBackward, FaStepForward } from "react-icons/fa";

// Simulando uma playlist de vídeos
const playlist = [
  { id: 0, title: "Vídeo 1 - Natureza", src: "data/videos/video1.mp4" },
  { id: 1, title: "Vídeo 2 - Cidade", src: "data/videos/video2.mp4" },
  { id: 2, title: "Vídeo 3 - Espaço", src: "data/videos/video3.mp4" }
];

type ColorFilter = 'normal' | 'sem cores' | 'tom de cinza' | 'tom de vermelho' | 'tom de verde' | 'tom de azul';

export default function Home() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<ColorFilter>('normal');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }

    video.onloadedmetadata = () => {
      setDuration(video.duration);
    };

    video.ontimeupdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.onended = () => {
      nextTrack();
    };
  }, [videoIndex, playing]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.trunc(time / 60);
    const seconds = Math.trunc(time % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }

  const playPause = () => {
    setPlaying(!playing);
  }

  const nextTrack = () => {
    setVideoIndex((prev) => (prev + 1) % playlist.length);
    setPlaying(true);
  }

  const prevTrack = () => {
    setVideoIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setPlaying(true);
  }

  const selectTrack = (index: number) => {
    setVideoIndex(index);
    setPlaying(true);
  }

  const configVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    setVolume(value);
  }

  const configCurrentTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }

  const skipTime = (amount: number) => {
    const video = videoRef.current;
    if (!video) return;
    let newTime = video.currentTime + amount;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    configCurrentTime(newTime);
  }

  const filterOptions: ColorFilter[] = [
    'normal', 'sem cores', 'tom de cinza', 'tom de vermelho', 'tom de verde', 'tom de azul'
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen justify-center p-5 bg-gray-900">
      {/* O container foi alargado (max-w-4xl) para acomodar melhor a proporção 16:9 do vídeo */}
      <div className="flex flex-col bg-purple-500 w-full max-w-4xl p-6 items-center justify-center rounded-3xl shadow-xl">
        
        {/* Renderizador de Vídeo com Filtros */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-inner cursor-pointer" onClick={playPause}>
          <video 
            ref={videoRef} 
            src={playlist[videoIndex].src} 
            className={`w-full h-full object-cover transition-all duration-300 ${
              activeFilter === 'sem cores' ? 'grayscale' :
              activeFilter === 'tom de cinza' ? 'grayscale contrast-125 brightness-90' : ''
            }`}
          />
          
          {/* Camadas de sobreposição para cores (Mix-Blend-Mode garante que a cor tinja o vídeo sem ocultá-lo) */}
          {activeFilter === 'tom de vermelho' && <div className="absolute inset-0 bg-red-600 mix-blend-color pointer-events-none"></div>}
          {activeFilter === 'tom de azul' && <div className="absolute inset-0 bg-blue-600 mix-blend-color pointer-events-none"></div>}
          {activeFilter === 'tom de verde' && <div className="absolute inset-0 bg-green-600 mix-blend-color pointer-events-none"></div>}
        </div>

        {/* Controles de Filtro de Cor */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center w-full">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ${
                activeFilter === f 
                  ? 'bg-white text-purple-900 shadow-md transform scale-105' 
                  : 'bg-purple-700 text-purple-100 hover:bg-purple-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-full mb-6 bg-white/20 rounded-xl p-3 shadow-inner">
          <h3 className="text-white font-bold text-center mb-3">Lista de Reprodução de Vídeos</h3>
          <ul className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {playlist.map((track, index) => (
              <li 
                key={track.id} 
                onClick={() => selectTrack(index)}
                className={`cursor-pointer p-2 rounded-lg text-center transition-colors ${
                  index === videoIndex 
                    ? 'bg-purple-700 text-white font-bold shadow-md'
                    : 'text-purple-100 hover:bg-purple-600'
                }`}
              >
                {track.title} {index === videoIndex && (playing ? " 🎬" : " ⏸️")}
              </li>
            ))}
          </ul>
        </div>

        {/* Controles de Reprodução */}
        <div className="flex items-center gap-6 mb-6 text-3xl text-white">
          <button onClick={prevTrack} className="hover:text-purple-300 transition-colors" title="Vídeo Anterior">
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

          <button onClick={nextTrack} className="hover:text-purple-300 transition-colors" title="Próximo Vídeo">
            <FaStepForward />
          </button>
        </div>

        {/* Barra de Progresso */}
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

        {/* Controle de Volume */}
        <div className="flex w-full md:w-1/2 items-center gap-3 text-white text-sm font-medium">
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