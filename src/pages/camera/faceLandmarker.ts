import { FaceLandmarker } from '@mediapipe/tasks-vision';
import wasmLoaderPath from '../../../node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.js?url';
import wasmBinaryPath from '../../../node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.wasm?url';
import modelAssetPath from '../../assets/models/face_landmarker.task?url';

let landmarkerPromise: Promise<FaceLandmarker> | undefined;

export function getFaceLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = { wasmLoaderPath, wasmBinaryPath };
      const options = {
        runningMode: 'VIDEO' as const,
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      };

      try {
        return await FaceLandmarker.createFromOptions(vision, {
          ...options,
          baseOptions: { modelAssetPath, delegate: 'GPU' },
        });
      } catch {
        return FaceLandmarker.createFromOptions(vision, {
          ...options,
          baseOptions: { modelAssetPath, delegate: 'CPU' },
        });
      }
    })().catch((error) => {
      landmarkerPromise = undefined;
      throw error;
    });
  }

  return landmarkerPromise;
}

export async function preloadFaceLandmarker() {
  await getFaceLandmarker();
}
