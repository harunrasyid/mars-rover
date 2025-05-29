import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Terrain = () => {
  const { scene } = useGLTF("/terrain.glb");
  scene.scale.set(0.01, 0.01, 0.01);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} />
    </RigidBody>
  );
};
