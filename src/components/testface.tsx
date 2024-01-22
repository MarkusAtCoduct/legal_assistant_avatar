import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/Addons.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";


export const Face = () => {


  const meshRef = useRef<THREE.Mesh>(null);
  const ktx2Loader = new KTX2Loader().setTranscoderPath("jsm/libs/basis/");
  const { scene } = useGLTF("/Ingotestproject.glb", true, true, (loader) => {
    loader.setKTX2Loader(ktx2Loader), loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const mesh = scene.children[0];
  const head = scene.getObjectByName("Ingo_FaceMesh_skin001");
  let frameIndex = 0;
  let visemeIndex = 0;
  const morphTargetNames = head.morphTargetDictionary;
  console.log(morphTargetNames);


  return (
    <mesh ref={meshRef}>
      <primitive object={scene} />
    </mesh>
  );
};
