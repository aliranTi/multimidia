
"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPauseCircle, FaPlayCircle} from "react-icons/fa";


export default function Home() {
  const [playing, isPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (playing) {
      play();
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    }

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    }

    audio.onended = () => {
      setAudioIndex(audioIndex + 1);
    }
  }, [audioIndex])

  useEffect(()=>{
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.trunc(time/60);
    const seconds = Math.trunc(time % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play();
  }

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }

  const playPause = () => {
    if (playing) {
      pause();
    }
    else {
      play();
    }
    isPlaying(!playing);
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

  return (
    <div className="flex bg-purple-400 w-100 h-25 mr-auto ml-auto items-center justify-center">

      <div className="items-center flex flex-col w-50 m-0 mr-auto ml-auto">
        <audio ref={audioRef} src={"audio1.mp3"} controls hidden></audio>
        <button onClick={() => playPause()} >
          {
            playing ? <FaPauseCircle /> : <FaPlayCircle />
          }
        </button>
        <input type="range"
          min={0}
          max={1}
          step={0.001}
          value={volume}
          onChange={(e) => configVolume(Number(e.target.value))}
        />
        <div className="flex">
          <p>{formatTime(currentTime)}</p>
          <input 
            type="range"
            min={0}
            step={0.001}
            max={duration}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
          />
          <p>{formatTime(duration)}</p>
        </div>
        <div>
          <button className="mr-4" onClick={()=>configCurrentTime(currentTime - 10)}>
            <FaBackward />
          </button>

          <button onClick={() => configCurrentTime(currentTime + 10)}>
             <FaForward />
          </button>
        </div>
        
      </div>
    </div>
  );
}