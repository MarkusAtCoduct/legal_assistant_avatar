import { useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { AnimationClip, AnimationMixer, AnimationAction, Clock } from "three";
import { useFrame } from "@react-three/fiber";
import { CognitiveSubscriptionKeyAuthentication } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/CognitiveSubscriptionKeyAuthentication";

export const FaceCopy = (shapekeys: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const clock = new Clock();

  const ktx2Loader = new KTX2Loader().setTranscoderPath("jsm/libs/basis/");

  const { scene, animations } = useGLTF("/facecap.glb", true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader), loader.setMeshoptDecoder(MeshoptDecoder);
  });

	const mesh = scene.children[0];
	const head = mesh.getObjectByName("mesh_2");
  
  
  useLayoutEffect(() => {
    if (!head || !shapekeys) return;

  // Check if the morph targets are available
    const mixer = new AnimationMixer(mesh);
    
    mixerRef.current = mixer;
    const morphTargetNames = Object.keys(head.morphTargetDictionary);

    const keys = shapekeys.shapekeys

    const shapekeyMapping = keys.map((shapekey) => {
      shapekey = shapekey.slice(0, 52);
      return shapekey.reduce((acc, value, index) => {
          const name = morphTargetNames[index];
          if (!name) {
              console.error(`No morph target name found for index ${index}`);
              return acc;
          }
          acc[name] = value;
          return acc;
      }, {});
  });
  let allTracks = [];

  shapekeyMapping.forEach((shapekey, index) => {
    const tracks = Object.entries(shapekey).map(([name, value], index) => {
        const time = index / (Object.keys(shapekey).length - 1);
        return new THREE.KeyframeTrack(
            `${name}.morphTargetInfluences`,
            [time, time + 1],
            [value, 0]
        );
    });
    allTracks = [...allTracks, ...tracks];

  });
    // Add the tracks to the mixer
    const clip = new THREE.AnimationClip(`shapekey`, 1, allTracks);
      //const clip = new THREE.AnimationClip("expression", 1, [track]);
     //console.log(clip);
      mixer.clipAction(clip).play();
      //action.play();


    // Play the first animation
  mixer.clipAction( animations[0]).play();

  console.log(animations[0]);
}, [head, shapekeys]);


  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
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
    <mesh ref={meshRef} >
      <primitive object={scene}  />
    </mesh>
  );
};
