"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Loader2 } from "lucide-react";

interface ProductView360Props {
  imageUrl: string;
}

function RotatingSphere({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (loadedTexture) => {
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
        setTexture(loadedTexture);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
        setLoading(false);
      }
    );
  }, [imageUrl]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
      </div>
    );
  }

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 60, 40]} />
      {texture && <meshStandardMaterial map={texture} side={THREE.BackSide} />}
    </mesh>
  );
}

export default function ProductView360({ imageUrl }: ProductView360Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full aspect-square bg-luxury-ivory-dark rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-square bg-luxury-ivory-dark rounded-lg overflow-hidden relative">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={8}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingSphere imageUrl={imageUrl} />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
