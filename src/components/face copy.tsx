import { useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { AnimationClip, AnimationMixer, AnimationAction, Clock } from "three";
import { useFrame } from "@react-three/fiber";

export const FaceCopy = (shapekeys: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const clock = new Clock();

  const ktx2Loader = new KTX2Loader().setTranscoderPath("jsm/libs/basis/");

  const { scene } = useGLTF("/facecap.glb", true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader), loader.setMeshoptDecoder(MeshoptDecoder);
  });

 

	const mesh = scene.children[0];
	const head = mesh.getObjectByName("mesh_2");

  useLayoutEffect(() => {
	
	if (!head) {
	  console.error("The head object was not found");
	  return;
	}
    const mixer = new AnimationMixer(head);
    mixerRef.current = mixer;
	//console.log(meshRef.current?.morphTargetDictionary)

    Object.entries(shapekeys.shapekeys).forEach(([name, influences]) => {
		const keyframes = influences.map((influence, index) => ({
			value: influence,
			time: index / (influences.length - 1),
		  }));

      const track = new THREE.NumberKeyframeTrack(
        `${name}.morphTargetInfluence`,
        keyframes.map((keyframe) => keyframe.time),
        keyframes.map((keyframe) => keyframe.value)
      );

      const animationClip = new THREE.AnimationClip(name, -1, [track]);

      const action = mixer.clipAction(animationClip);
      action.play();
    });

    head.updateMorphTargets();
  }, [shapekeys]);

  useFrame(() => {
    if (mixerRef.current) {
      const delta = clock.getDelta();
      mixerRef.current.update(delta);
    }
  });



  if (!head.morphTargetInfluences || !head.morphTargetDictionary) {
    console.error("The head object does not have morph targets");
    return null;
  }

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
