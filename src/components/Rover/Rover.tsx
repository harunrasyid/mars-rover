import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Rover = () => {
  const { scene } = useGLTF("/rover.glb");

  return (
    <RigidBody
      colliders="cuboid"
      mass={5}
      friction={1}
      restitution={0}
      position={[0, 2, 0]}
    >
      <primitive object={scene} scale={0.1} />
    </RigidBody>
  );
};
