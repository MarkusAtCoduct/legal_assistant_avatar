import "./App.css";

import { Bvh, OrbitControls, Stage } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { FaceCopy } from "./components/face copy";
import { useSpeechSynthesis } from "./speech";
import { Face } from "./components/testface";

function App() {
  const [text, setText] = useState("");
  const { startSpeechSynthesis, visemes } = useSpeechSynthesis();

  return (
    <>
    <div>
    <input
      name="text"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => startSpeechSynthesis(text)}> Talk</button>
      </div>
      <div className="Canvas">
      <Canvas>
        <Stage shadows>
          
        <FaceCopy visemeData={visemes} />
        {/* <Face /> */}
        </Stage>
        <OrbitControls />
      </Canvas>
      
    </div>
    </>
  );
}

export default App;
