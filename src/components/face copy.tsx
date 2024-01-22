import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { useFrame } from "@react-three/fiber";
import { mapBlendshapes } from "../utils/blendshapemappings";
import { useAtom } from "jotai";
import { speakingAtom } from "../atoms/speakingAtom";

export const FaceCopy = (visemeData: []) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [speaking, setSpeaking] = useAtom(speakingAtom);

  const ktx2Loader = new KTX2Loader().setTranscoderPath("jsm/libs/basis/");

  const { scene } = useGLTF("/Ingotestproject.glb", true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader), loader.setMeshoptDecoder(MeshoptDecoder);
  });

  // const mesh = scene.children[0];
  // const head = mesh.getObjectByName("mesh_2");

  const head = scene.getObjectByName("Ingo_FaceMesh_skin001");

  let frameIndex = 0;
  let visemeIndex = 0;
  const morphTargetNames = Object.keys(head.morphTargetDictionary);
  const test = visemeData.visemeData;

  let accumulatedDelta = 0;

  useFrame((state, delta) => {
    // console.log(speaking);
    if (test.length === 0 || visemeIndex === test.length) return;
    accumulatedDelta += delta;
    let frameOffsetInSeconds;
    if(visemeIndex === 0) {  frameOffsetInSeconds = test[visemeIndex].frameOffset / 10000;}
    else {
    frameOffsetInSeconds = (test[visemeIndex].frameOffset - test[visemeIndex-1].frameOffset) / 10000;
    }

if (accumulatedDelta > 1/80) {
    const shapekeyMapping = mapBlendshapes(
      test[visemeIndex].visemeBlendshapes,
      morphTargetNames
    );
    
    if (shapekeyMapping && shapekeyMapping[frameIndex]) {
      //console.log(shapekeyMapping);
      Object.entries(shapekeyMapping[frameIndex]).forEach(
        ([influenceName, value]) => {
          const influenceIndex = head.morphTargetDictionary[influenceName];
          head.morphTargetInfluences[influenceIndex] = value;
        }
      );
      frameIndex++;
    }
    if (shapekeyMapping && frameIndex >= shapekeyMapping.length) {
      visemeIndex++;
      frameIndex = 0;
    }
    accumulatedDelta = 0;
  }

  });


  //const shapekeyMapping = mapBlendshapes(keys, morphTargetNames);

  // let accumulatedDelta = 0;

  // useFrame((state, delta) => {
  //   if (frameIndex >= shapekeyMapping.length) return;
  //   accumulatedDelta += delta;

  //   if (accumulatedDelta > 1 / 60) {
  //     if (shapekeyMapping && shapekeyMapping[frameIndex]) {
  //       Object.entries(shapekeyMapping[frameIndex]).forEach(
  //         ([influenceName, value]) => {
  //           const influenceIndex = head.morphTargetDictionary[influenceName];
  //           head.morphTargetInfluences[influenceIndex] = value;
  //         }
  //       );

  //       frameIndex++;
  //     }
  //     accumulatedDelta = 0;
  //   }
  // });

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
