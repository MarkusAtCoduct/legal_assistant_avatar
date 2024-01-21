import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { useFrame } from "@react-three/fiber";
import { mapBlendshapes } from "../utils/blendshapemappings";


import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useEffect } from "react";

export const Face = (shapekeys: any, text: string) => {
  const [animation, setAnimation] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const interimAnimation = [];


  useEffect(() => {

    console.log(text);
  const speechConfig = sdk.SpeechConfig.fromSubscription(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  const speechSynthesisVoiceName  = "de-DE-KatjaNeural";  
  const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
      <voice name='${speechSynthesisVoiceName}'> \r\n \
      <mstts:viseme type="FacialExpression"/> \r\n \
          '${text}' \r\n \
      </voice> \r\n \
  </speak>`;
  
  speechConfig.setProperty(sdk.PropertyId.SpeechServiceResponse_RequestSentenceBoundary, "true");
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.visemeReceived = function(s, e) {

      const ani = JSON.parse(e.animation);
      interimAnimation.push(ani.BlendShapes);

      //setAnimation(prevAnimation => [...prevAnimation, ani.BlendShapes]);
      //console.log(animation);
      //setAnimation(prevAnimation => [ani.BlendShapes]);
    };

    synthesizer.synthesisCompleted = function(s, e) {
      setIsSpeaking(true);
    };

    synthesizer.speakSsmlAsync(ssml,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        setAnimation(interimAnimation.flat());
        setIsSpeaking(false);
    }
      if (result.reason !== sdk.ResultReason.SynthesizingAudioCompleted) {
        console.error("Speech synthesis canceled, " + result.errorDetails +
        "\nDid you set the speech resource key and region values?");
        setIsSpeaking(false);
      }        
      synthesizer.close();
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer.close();
    }
  );

      
  }, [text]);

  const meshRef = useRef<THREE.Mesh>(null);
  const ktx2Loader = new KTX2Loader().setTranscoderPath("jsm/libs/basis/");
  const { scene } = useGLTF("/facecap.glb", true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader), loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const mesh = scene.children[0];
  const head = mesh.getObjectByName("mesh_2");
  let frameIndex = 0;
  const morphTargetNames = Object.keys(head.morphTargetDictionary);
  const keys = shapekeys.shapekeys;
  const shapekeyMapping = mapBlendshapes(keys, morphTargetNames);
  let accumulatedDelta = 0;

  useFrame((state, delta) => {
    if (frameIndex >= shapekeyMapping.length) return;
    accumulatedDelta += delta;

    if (accumulatedDelta > 1 / 60) {
      if (shapekeyMapping && shapekeyMapping[frameIndex]) {
        Object.entries(shapekeyMapping[frameIndex]).forEach(
          ([influenceName, value]) => {
            const influenceIndex = head.morphTargetDictionary[influenceName];
            head.morphTargetInfluences[influenceIndex] = value;
          }
        );

        frameIndex++;
      }
      accumulatedDelta = 0;
    }
  });

  const influences = head.morphTargetInfluences;

  const gui = new GUI();
  gui.close();
  for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
    gui
      .add(influences, value, 0, 1, 0.01)
      .name(key.replace("blendShape1.", ""))
      .listen();
  }

  return (
    <mesh ref={meshRef}>
      <primitive object={scene} />
    </mesh>
  );
};
