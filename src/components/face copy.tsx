import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader, KTX2Loader } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { useSpeechSynthesis } from "../speech";

export const FaceCopy = (influences: any) => {
  const {scene} = useThree()
  const {animation } = useSpeechSynthesis();

  let mixer;

  const ktx2Loader = new KTX2Loader()
  .setTranscoderPath( 'jsm/libs/basis/' )
  //.detectSupport( renderer );

new GLTFLoader()
  .setKTX2Loader( ktx2Loader )
  .setMeshoptDecoder( MeshoptDecoder )
  .load( '/facecap.glb', ( gltf ) => {

    const mesh = gltf.scene.children[ 0 ];

    scene.add( mesh );

    mixer = new THREE.AnimationMixer( mesh );

    //mixer.clipAction( gltf.animations[ 0 ] ).play();

    // GUI

    const head = mesh.getObjectByName( 'mesh_2' );
    influences = head.morphTargetInfluences;

    const gui = new GUI();
    gui.close();

    for ( const [ key, value ] of Object.entries( head.morphTargetDictionary ) ) {

      gui.add( influences, value, 0, 1, 0.01 )
        .name( key.replace( 'blendShape1.', '' ) )
        //.listen();

    }

  } );



  return null
}