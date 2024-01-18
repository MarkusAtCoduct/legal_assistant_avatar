import "./App.css";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { FaceCopy } from "./components/face copy";
import { useSpeechSynthesis } from "./speech";

function App() {
  const [text, setText] = useState("");
  const { startSpeechSynthesis, animation } = useSpeechSynthesis();

  return (
    <>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <FaceCopy key={animation} shapekeys={animation.flat()} />
        <OrbitControls />
      </Canvas>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => startSpeechSynthesis(text)}></button>
    </>
  );
}

export default App;
