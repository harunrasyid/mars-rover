import { useRef, useState, useEffect } from "react";
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

  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.code) {
        case "KeyW":
          setKeys((k) => ({ ...k, forward: true }));
          break;
        case "KeyS":
          setKeys((k) => ({ ...k, backward: true }));
          break;
        case "KeyA":
          setKeys((k) => ({ ...k, left: true }));
          break;
        case "KeyD":
          setKeys((k) => ({ ...k, right: true }));
          break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          setKeys((k) => ({ ...k, forward: false }));
          break;
        case "KeyS":
          setKeys((k) => ({ ...k, backward: false }));
          break;
        case "KeyA":
          setKeys((k) => ({ ...k, left: false }));
          break;
        case "KeyD":
          setKeys((k) => ({ ...k, right: false }));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const body = roverRef.current;
    if (!body) return;

    const transform = body.translation();
    const velocity = body.linvel();
    const rotation = body.rotation();

    const velocityVec = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
    const speed = velocityVec.length();

    const maxSpeed = 10;
    const q = new THREE.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(q).normalize();

    let force = new THREE.Vector3();

    // Apply force scaled by delta
    if (keys.forward && speed < maxSpeed) {
      force.add(forward.clone().multiplyScalar(0.5 * delta)); // smaller & scaled by delta
    }
    if (keys.backward && speed < maxSpeed) {
      force.add(forward.clone().multiplyScalar(-0.5 * delta));
    }

    // Turning torque scaled by delta
    if (keys.left) {
      body.applyTorqueImpulse({ x: 0, y: 0.1 * delta, z: 0 }, true);
    }
    if (keys.right) {
      body.applyTorqueImpulse({ x: 0, y: -0.1 * delta, z: 0 }, true);
    }

    // Apply the smooth driving force
    body.addForce({ x: force.x, y: force.y, z: force.z }, true);

    const angVel = body.angvel();
    const maxAngularSpeed = 2;

    body.setAngvel(
      {
        x: THREE.MathUtils.clamp(angVel.x, -maxAngularSpeed, maxAngularSpeed),
        y: THREE.MathUtils.clamp(angVel.y, -maxAngularSpeed, maxAngularSpeed),
        z: THREE.MathUtils.clamp(angVel.z, -maxAngularSpeed, maxAngularSpeed),
      },
      true
    );

    // Spring camera
    const offset = { x: 0, y: 2, z: -5 };
    targetPos.set(
      transform.x + offset.x,
      transform.y + offset.y,
      transform.z + offset.z
    );
    currentPos.current.lerp(targetPos, 0.1);
    camera.position.copy(currentPos.current);
    camera.lookAt(transform.x, transform.y, transform.z);
  });

  return (
    <RigidBody
      ref={roverRef}
      colliders="hull"
      mass={5}
      friction={1}
      restitution={0}
      position={[-5, 4, 3]}
      angularDamping={10}
      linearDamping={1}
    >
      <primitive object={scene} />
    </RigidBody>
  );
};
