import { Suspense } from "react";
import { VStack } from "@chakra-ui/react";
import { Environment, Loader, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Rover, Terrain } from "./components";
import { styles } from "./App.style.ts";

function App() {
  return (
    <VStack sx={styles.page}>
      {/* Loader */}
      <Loader />

      {/* Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1} />
          <Sky />
          <Environment preset="sunset" />
          <OrbitControls />

          <Physics gravity={[0, -9.81, 0]}>
            {/* Terrain */}
            <Terrain />

            {/* Rover */}
            <Rover />
          </Physics>
        </Suspense>
      </Canvas>
    </VStack>
  );
}

export default App;
