/**
 * AR Manager - Handles MediaPipe landmark detection and Three.js 3D rendering
 * Modular component for jewellery AR try-on experience
 */

import * as THREE from "three";
import { MediaPipeLandmarks } from "@/lib/mediapipe-detector";

export class ARManager {
  private canvas: HTMLCanvasElement;
  private video: HTMLVideoElement;
  private category: string;
  private modelUrl?: string;

  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private jewelleryModel: THREE.Group | null = null;
  private mediaPipeDetector: MediaPipeLandmarks | null = null;

  private animationFrameId: number | null = null;
  private isInitialized = false;

  constructor(
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    category: string,
    modelUrl?: string
  ) {
    this.canvas = canvas;
    this.video = video;
    this.category = category.toLowerCase();
    this.modelUrl = modelUrl;
  }

  async initialize(): Promise<void> {
    try {
      // Initialize Three.js scene
      await this.setupThreeJS();

      // Initialize MediaPipe detector
      await this.setupMediaPipe();

      // Load 3D model
      await this.loadJewelleryModel();

      // Start render loop
      this.startRenderLoop();

      this.isInitialized = true;
    } catch (error) {
      console.error("AR Manager initialization error:", error);
      throw error;
    }
  }

  private async setupThreeJS(): Promise<void> {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background for video overlay

    // Camera setup - matches video aspect ratio
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 0;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting for realistic jewellery rendering
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, -5, 5);
    this.scene.add(pointLight);
  }

  private async setupMediaPipe(): Promise<void> {
    this.mediaPipeDetector = new MediaPipeLandmarks(this.category);
    await this.mediaPipeDetector.initialize();
  }

  private async loadJewelleryModel(): Promise<void> {
    if (!this.scene) return;

    // If custom model URL provided, load it
    if (this.modelUrl) {
      try {
        // Dynamically import GLTFLoader to avoid SSR issues
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(this.modelUrl);
        this.jewelleryModel = gltf.scene;
        this.scene.add(this.jewelleryModel);
      } catch (error) {
        console.warn("Failed to load custom model, using template:", error);
        this.createTemplateModel();
      }
    } else {
      // Create template-based model based on category
      this.createTemplateModel();
    }

    // Initially hide model until landmarks are detected
    if (this.jewelleryModel) {
      this.jewelleryModel.visible = false;
    }
  }

  private createTemplateModel(): void {
    if (!this.scene) return;

    this.jewelleryModel = new THREE.Group();

    // Category-specific template geometry
    if (this.category.includes("ring")) {
      // Ring template - torus shape
      const ringGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 100);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37, // Gold color
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.0,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      this.jewelleryModel.add(ring);
    } else if (this.category.includes("necklace")) {
      // Necklace template - chain-like curve
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.4, 0, 0),
        new THREE.Vector3(-0.2, -0.1, 0),
        new THREE.Vector3(0, -0.15, 0),
        new THREE.Vector3(0.2, -0.1, 0),
        new THREE.Vector3(0.4, 0, 0),
      ]);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xd4af37 });
      const necklace = new THREE.Line(geometry, material);
      this.jewelleryModel.add(necklace);
    } else if (this.category.includes("earring")) {
      // Earring template - dangling shape
      const earringGroup = new THREE.Group();
      const topGeometry = new THREE.SphereGeometry(0.03, 16, 16);
      const topMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.1,
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.set(0, 0, 0);
      earringGroup.add(top);

      const bottomGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const bottom = new THREE.Mesh(bottomGeometry, topMaterial);
      bottom.position.set(0, -0.1, 0);
      earringGroup.add(bottom);

      this.jewelleryModel.add(earringGroup);
    } else if (this.category.includes("bracelet")) {
      // Bracelet template - circular band
      const braceletGeometry = new THREE.TorusGeometry(0.25, 0.03, 16, 100);
      const braceletMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.1,
      });
      const bracelet = new THREE.Mesh(braceletGeometry, braceletMaterial);
      bracelet.rotation.x = Math.PI / 2;
      this.jewelleryModel.add(bracelet);
    } else if (this.category.includes("anklet")) {
      // Anklet template - similar to bracelet
      const ankletGeometry = new THREE.TorusGeometry(0.2, 0.02, 16, 100);
      const ankletMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.1,
      });
      const anklet = new THREE.Mesh(ankletGeometry, ankletMaterial);
      anklet.rotation.x = Math.PI / 2;
      this.jewelleryModel.add(anklet);
    } else if (this.category.includes("tiara") || this.category.includes("crown")) {
      // Tiara/Crown template - curved band
      const crownGeometry = new THREE.TorusGeometry(0.35, 0.04, 16, 100);
      const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.1,
      });
      const crown = new THREE.Mesh(crownGeometry, crownMaterial);
      crown.rotation.x = Math.PI / 2;
      this.jewelleryModel.add(crown);
    }

    this.scene.add(this.jewelleryModel);
  }

  private startRenderLoop(): void {
    const animate = async () => {
      if (!this.isInitialized) return;

      this.animationFrameId = requestAnimationFrame(animate);

      // Update landmarks and position jewellery
      await this.updateJewelleryPosition();

      // Render scene
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  private async updateJewelleryPosition(): Promise<void> {
    if (!this.mediaPipeDetector || !this.jewelleryModel || !this.camera) return;

    const landmarks = await this.mediaPipeDetector.getLandmarks(this.video);
    if (!landmarks) {
      this.jewelleryModel.visible = false;
      return;
    }

    // Category-specific positioning logic
    const position = this.getCategoryPosition(landmarks);
    if (position) {
      this.jewelleryModel.visible = true;
      this.jewelleryModel.position.copy(position.position);
      this.jewelleryModel.rotation.copy(position.rotation);
      this.jewelleryModel.scale.setScalar(position.scale);
    } else {
      this.jewelleryModel.visible = false;
    }
  }

  private getCategoryPosition(landmarks: any): {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: number;
  } | null {
    // Convert 2D landmarks to 3D world coordinates
    // This is a simplified version - actual implementation would use proper coordinate transformation

    if (this.category.includes("ring")) {
      // Position on finger joint
      const fingerLandmark = landmarks.handLandmarks?.[8]; // Index finger tip
      if (fingerLandmark) {
        return {
          position: new THREE.Vector3(
            (fingerLandmark.x - 0.5) * 2,
            -(fingerLandmark.y - 0.5) * 2,
            -fingerLandmark.z * 2
          ),
          rotation: new THREE.Euler(0, 0, 0),
          scale: 0.5,
        };
      }
    } else if (this.category.includes("necklace")) {
      // Position on neck/collarbone
      const neckLandmark = landmarks.faceLandmarks?.[10]; // Neck point
      if (neckLandmark) {
        return {
          position: new THREE.Vector3(
            (neckLandmark.x - 0.5) * 2,
            -(neckLandmark.y - 0.5) * 2,
            -neckLandmark.z * 2
          ),
          rotation: new THREE.Euler(0, 0, 0),
          scale: 0.8,
        };
      }
    } else if (this.category.includes("earring")) {
      // Position on ear
      const earLandmark = landmarks.faceLandmarks?.[234]; // Ear point
      if (earLandmark) {
        return {
          position: new THREE.Vector3(
            (earLandmark.x - 0.5) * 2,
            -(earLandmark.y - 0.5) * 2,
            -earLandmark.z * 2
          ),
          rotation: new THREE.Euler(0, 0, 0),
          scale: 0.3,
        };
      }
    } else if (this.category.includes("bracelet")) {
      // Position on wrist
      const wristLandmark = landmarks.handLandmarks?.[0]; // Wrist
      if (wristLandmark) {
        return {
          position: new THREE.Vector3(
            (wristLandmark.x - 0.5) * 2,
            -(wristLandmark.y - 0.5) * 2,
            -wristLandmark.z * 2
          ),
          rotation: new THREE.Euler(Math.PI / 2, 0, 0),
          scale: 0.6,
        };
      }
    } else if (this.category.includes("anklet")) {
      // Position on ankle
      const ankleLandmark = landmarks.poseLandmarks?.[28]; // Ankle
      if (ankleLandmark) {
        return {
          position: new THREE.Vector3(
            (ankleLandmark.x - 0.5) * 2,
            -(ankleLandmark.y - 0.5) * 2,
            -ankleLandmark.z * 2
          ),
          rotation: new THREE.Euler(Math.PI / 2, 0, 0),
          scale: 0.5,
        };
      }
    } else if (this.category.includes("tiara") || this.category.includes("crown")) {
      // Position on head
      const headLandmark = landmarks.faceLandmarks?.[10]; // Forehead
      if (headLandmark) {
        return {
          position: new THREE.Vector3(
            (headLandmark.x - 0.5) * 2,
            -(headLandmark.y - 0.5) * 2 + 0.3,
            -headLandmark.z * 2
          ),
          rotation: new THREE.Euler(0, 0, 0),
          scale: 0.7,
        };
      }
    }

    return null;
  }

  dispose(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.mediaPipeDetector) {
      this.mediaPipeDetector.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.jewelleryModel) {
      this.jewelleryModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    this.isInitialized = false;
  }
}
