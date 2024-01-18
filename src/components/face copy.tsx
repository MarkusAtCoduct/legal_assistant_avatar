import { useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { AnimationMixer } from "three";
import { useFrame } from "@react-three/fiber";
import { mapBlendshapes } from "../utils/blendshapemappings";

export const FaceCopy = (shapekeys: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);

  const ktx2Loader = new KTX2Loader().setTranscoderPath("jsm/libs/basis/");

  const { scene } = useGLTF("/facecap.glb", true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader), loader.setMeshoptDecoder(MeshoptDecoder);
  });

  const mesh = scene.children[0];
  const head = mesh.getObjectByName("mesh_2");
  const mixer = new AnimationMixer(scene);
  let frameIndex = 0;
  mixerRef.current = mixer;
    const morphTargetNames = Object.keys(head.morphTargetDictionary);
    const keys = shapekeys.shapekeys;
    const shapekeyMapping = mapBlendshapes(keys, morphTargetNames);

  // useEffect(() => {
  //   if (!head || !shapekeys) return;
    
  //   const allTracks: any[] = [];

  //   // shapekeyMapping.forEach((shapekey, frameIndex) => {
  //   //   Object.entries(shapekey).forEach(([name, value], index) => {
  //   //     const startTime = 0; // S
  //   //     // Create a track for this morph target
  //   //     const track = new THREE.NumberKeyframeTrack(
  //   //       `mesh_2.morphTargetInfluences[${name}]`,
  //   //       [startTime, startTime + 0.5, startTime + 1], // Keyframe at start, middle, and end
  //   //       [0, value, 0]
  //   //     );

  //   //     allTracks.push(track);
  //   //   });
  //   // });

  //   // const clip = new THREE.AnimationClip("expression", -1, allTracks);
  //   // const action = mixer.clipAction(clip);
  //   // action.setLoop(THREE.LoopOnce, 1);
  //   // action.clampWhenFinished = true;
  //   // action.play();
  // }, []);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  useEffect(() => {
    let frameIndex = 0;
  

  const updateInterval = setInterval(() => {
    if (frameIndex >= shapekeyMapping.length) {
      // If we've gone through all frames, stop the interval
      clearInterval(updateInterval);
      return;
    }
    
    


    const shapekey = shapekeyMapping[frameIndex];
    Object.entries(shapekey).forEach(([name, value]) => {
      console.log(name, value);
      const morphTargetIndex = head.morphTargetDictionary[name];
      console.log(head.morphTargetDictionary);
      head.morphTargetInfluences[morphTargetIndex] = value;
    });
 
    frameIndex++;
  }, 20); // Run every 1000 milliseconds (1 second)
  return () => {
    // Clear the interval when the component is unmounted
    clearInterval(updateInterval);
  };
}, []);

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
