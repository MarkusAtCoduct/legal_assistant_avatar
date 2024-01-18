import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useRef } from "react";
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

  useLayoutEffect(() => {
    if (!head || !shapekeys) return;

    // Check if the morph targets are available
    const mixer = new AnimationMixer(scene);

    mixerRef.current = mixer;
    const morphTargetNames = Object.keys(head.morphTargetDictionary);
    const keys = shapekeys.shapekeys;

    const shapekeyMapping = mapBlendshapes(keys, morphTargetNames);
    let allTracks = [];

    console.log(shapekeyMapping);

    shapekeyMapping.forEach((shapekey, index) => {

      const tracks = Object.entries(shapekey).map(([name, value], index) => {
        const time = (index / (Object.keys(shapekey).length - 1));
        return new THREE.KeyframeTrack(
          `mesh_2.morphTargetInfluences[${name}]`,
          [time, time + 3],
          [value, 0]
        );
      });
      allTracks = [...allTracks, ...tracks];
    });
    
    // Add the tracks to the mixer
    const clip = new THREE.AnimationClip(`shapekey`, 1, allTracks);
    const action = mixer.clipAction(clip);
    console.log(action);
    //action.setLoop(THREE.LoopOnce, 1);
    //action.clampWhenFinished = true;
    action.play();
  }, [head, shapekeys, scene]);

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
    <mesh ref={meshRef}>
      <primitive object={scene} />
    </mesh>
  );
};
