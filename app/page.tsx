
"use client"

import { useState } from "react";

export default function Home() {
  const [contador, setContador] = useState<number>(0);
  const [passo, setPasso] = useState<number>(1);

  const increment = () => {
    setContador(contador + passo);
  }

  const decrement = () => {
    setContador(contador - passo);
  }

  return (
    <div className="items-center flex flex-col rounded-2xl border-gray-500 border-2 w-70 h-25 m-0 mr-auto ml-auto">
      <p>{contador}</p>
      <div className="flex gap-2">
        <button onClick={()=> decrement()} className="bg-blue-300 w-30 text-[#222]">Decrementar</button>
        <button onClick={()=> increment()} className="bg-blue-300 w-30 text-[#222]">Incrementar</button>
      </div>
      <div className="flex gap-2 mt-2 items-center justify-center flex-col">
        <input 
          type="number" 
          value={passo} 
          onChange={(e) => setPasso(Number(e.target.value))} 
          className="items-center text-center rounded-md border-gray-500 border-2 w-20"
        />
      </div>
    </div>
  );
}
