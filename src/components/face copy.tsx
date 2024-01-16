import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import {  KTX2Loader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export const FaceCopy = (influences: any) => {

	const meshRef = useRef<THREE.Mesh>(null);

	const ktx2Loader = new KTX2Loader().setTranscoderPath("jsm/libs/basis/");
	//.detectSupport( renderer );

	useLayoutEffect(() => {
		meshRef.current?.updateMorphTargets();
	}, []);

	const { scene } = useGLTF("/facecap.glb", true, true, (loader) => {
		loader.setKTX2Loader(ktx2Loader),
			loader.setMeshoptDecoder(MeshoptDecoder);
	});
	const mesh = scene.children[0];
	const head = mesh.getObjectByName("mesh_2");
	influences = head.morphTargetInfluences;

	const gui = new GUI();
	gui.close();
	for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
		gui.add(influences, value, 0, 1, 0.01)
			.name(key.replace("blendShape1.", ""))
			.listen();
	}

const anim = () => {
    head.morphTargetInfluences.map((inf, i) => {
      head.morphTargetInfluences[i] = 1;
    }
    )
  };


	return (
		<mesh ref={meshRef} onClick={() => anim()}>
			<primitive object={scene} />
		</mesh>
	);
};
