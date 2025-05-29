import { useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useThree, useFrame } from "@react-three/fiber";

export const Rover = () => {
  const { scene } = useGLTF("/rover.glb");
  scene.scale.set(0.1, 0.1, 0.1);

  const roverRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();

  const currentPos = useRef(new THREE.Vector3());
  const targetPos = new THREE.Vector3();

  useFrame(() => {
    if (roverRef.current) {
      const { x, y, z } = roverRef.current.translation();
      const offset = { x: 0, y: 1.5, z: -3 };

      // Target camera position behind and above the rover
      targetPos.set(x + offset.x, y + offset.y, z + offset.z);

      // Smooth follow using lerp (damping = 0.1)
      currentPos.current.lerp(targetPos, 0.1);

      // Update camera position and orientation
      camera.position.copy(currentPos.current);
      camera.lookAt(x, y, z);
    }
  });

  return (
    <RigidBody
      ref={roverRef}
      colliders="hull"
      mass={5}
      friction={1}
      restitution={0}
      position={[-5, 4, 3]}
    >
      <primitive object={scene} />
    </RigidBody>
  );
};
