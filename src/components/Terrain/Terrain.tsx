import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Terrain = () => {
  const { scene } = useGLTF("/terrain.glb");

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} scale={0.01} />
    </RigidBody>
  );
};
