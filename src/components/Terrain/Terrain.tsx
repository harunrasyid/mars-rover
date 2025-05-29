import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Terrain = () => {
  const { scene } = useGLTF("/terrain.glb");
  scene.scale.set(0.01, 0.01, 0.01);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} />
    </RigidBody>
    // <RigidBody type="fixed" colliders="cuboid" position={[0, 0, 0]}>
    //   <mesh scale={[20, 1, 20]} receiveShadow>
    //     <boxGeometry args={[1, 1, 1]} />
    //     <meshStandardMaterial color="green" />
    //   </mesh>
    // </RigidBody>
  );
};
