# AR/3D Try-On Feature Documentation

## Overview

This AR try-on feature is a modular component that integrates seamlessly into the existing Jaipuri Jewels web app. It provides real-time augmented reality experiences for trying on jewellery using MediaPipe landmark detection and Three.js 3D rendering.

## Architecture

### Components

1. **ARTryOnButton** (`components/ARTryOnButton.tsx`)
   - Main entry point for AR experience
   - Displays "Try Live on Yourself" button
   - Generates QR codes for sharing AR links

2. **ARTryOnViewer** (`components/ARTryOnViewer.tsx`)
   - Full-screen AR experience
   - Handles camera access and permissions
   - Manages AR lifecycle

3. **ARManager** (`lib/ar-manager.ts`)
   - Core AR logic and 3D rendering
   - Coordinates MediaPipe detection with Three.js rendering
   - Handles category-specific positioning

4. **MediaPipeLandmarks** (`lib/mediapipe-detector.ts`)
   - Landmark detection wrapper
   - Category-based detection selection
   - Normalized coordinate output

## Category-Based Placement Logic

### Rings
- **Detection**: Hand landmarks (MediaPipe Hands)
- **Anchor Point**: Finger joint (landmark index 8 - index finger tip)
- **Positioning**: Wraps around finger, auto-scales to finger size

### Necklaces
- **Detection**: Face landmarks (MediaPipe Face Mesh)
- **Anchor Point**: Neck/collarbone area (landmark index 10)
- **Positioning**: Curves along neckline, follows head movement

### Earrings
- **Detection**: Face landmarks (MediaPipe Face Mesh)
- **Anchor Point**: Ear region (landmark index 234)
- **Positioning**: Hangs from ear, mirrors head rotation

### Bracelets
- **Detection**: Hand landmarks (MediaPipe Hands)
- **Anchor Point**: Wrist (landmark index 0)
- **Positioning**: Wraps around wrist, follows hand orientation

### Anklets
- **Detection**: Pose landmarks (MediaPipe Pose)
- **Anchor Point**: Ankle (landmark index 28)
- **Positioning**: Wraps around ankle, follows leg movement

### Tiaras/Crowns
- **Detection**: Face landmarks (MediaPipe Face Mesh)
- **Anchor Point**: Forehead/head top (landmark index 10)
- **Positioning**: Sits on head, follows head rotation and tilt

## 3D Model Strategy

### Template Models
- Default template-based 3D models for each category
- Created using Three.js primitives (Torus, Sphere, Curve, etc.)
- Gold material with realistic metalness and roughness

### Custom Models
- Support for GLB/GLTF format
- Admin can upload custom 3D models via product form
- Models auto-scale and position based on landmarks

### Model Loading
```typescript
// Custom model URL from product.threeDModel
if (modelUrl) {
  const loader = new THREE.GLTFLoader();
  const gltf = await loader.loadAsync(modelUrl);
  jewelleryModel = gltf.scene;
}
```

## MediaPipe Integration

### Current Implementation
- Uses mock landmarks for development
- Structure matches real MediaPipe output
- Ready for production MediaPipe integration

### Production Setup
1. Install MediaPipe packages:
```bash
npm install @mediapipe/face_mesh @mediapipe/hands @mediapipe/pose
```

2. Update `lib/mediapipe-detector.ts` with real detection:
```typescript
// Replace mock methods with actual MediaPipe API calls
const faceMesh = new FaceMesh({...});
await faceMesh.send({image: videoFrame});
const results = faceMesh.getResults();
```

3. See `lib/mediapipe-real.ts` for implementation guide

## QR Code Integration

### Generation
- QR codes generated per product
- Links to product page with `?ar=true` parameter
- Auto-opens AR experience when scanned

### Usage
1. Click "Get QR Code for AR" button
2. QR code displays with product name
3. Scan with any device to open AR experience
4. Useful for in-store displays or sharing

## Performance Optimizations

1. **Lazy Loading**: AR components only load when needed
2. **Conditional MediaPipe**: Only loads required detection models
3. **Efficient Rendering**: Uses requestAnimationFrame for smooth 60fps
4. **Resource Cleanup**: Proper disposal of cameras, models, and detectors

## Browser Compatibility

### Supported
- Chrome/Edge (Android & Desktop) - Full support
- Safari (iOS 15+) - Full support
- Firefox - Partial support (may need WebXR polyfill)

### Requirements
- Modern browser with WebGL support
- Camera access permissions
- HTTPS (required for camera access)

## Fallback Behavior

- Graceful degradation for unsupported devices
- Clear error messages for permission issues
- Template models if custom model fails to load
- Mock landmarks if MediaPipe unavailable (development)

## Admin Panel Integration

### 3D Model Upload
- Admin can add 3D model URL in product form
- Supports GLB/GLTF formats
- Optional field - uses template if not provided

### Product Mapping
- Each product can have custom 3D model
- Category determines detection type
- Scale and position auto-calculated

## Testing

### Test Categories
1. **Ring**: Show hand, verify ring appears on finger
2. **Necklace**: Face camera, verify necklace on neck
3. **Earring**: Show ear, verify earring placement

### Test Scenarios
- Camera permission denied
- Unsupported browser
- Model loading failure
- Landmark detection failure

## Future Enhancements

1. **Real MediaPipe Integration**: Replace mocks with actual detection
2. **Multiple Jewellery**: Try on multiple pieces simultaneously
3. **Lighting Adjustment**: Match ambient lighting
4. **Save/Share**: Capture AR view and share
5. **Virtual Try-On Room**: Full body AR experience

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS connection
- Try different browser

### Model Not Appearing
- Verify landmarks are detected
- Check model URL is valid
- Check browser console for errors

### Performance Issues
- Reduce model complexity
- Lower video resolution
- Close other browser tabs

## Code Structure

```
components/
  ├── ARTryOnButton.tsx      # Entry button component
  ├── ARTryOnViewer.tsx      # Full-screen AR experience
  ├── ARAutoOpen.tsx         # Auto-open from QR
  └── QRCodeDisplay.tsx      # QR code generation

lib/
  ├── ar-manager.ts          # Core AR logic
  ├── mediapipe-detector.ts  # Landmark detection
  └── mediapipe-real.ts      # Production MediaPipe guide

app/products/[slug]/
  └── page.tsx               # Product page integration
```

## Integration Points

The AR feature integrates at:
1. **Product Detail Page**: AR button in product details section
2. **QR Code Access**: Direct AR access via URL parameter
3. **Admin Panel**: 3D model URL input in product form

No breaking changes to existing functionality - completely modular!
