import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export type CameraCondition = {
  hasFace: boolean;
  isAligned: boolean;
  isFrontFacing: boolean;
};

type Size = { width: number; height: number };
type Point = { x: number; y: number };

const LEFT_EYE_OUTER = 33;
const RIGHT_EYE_OUTER = 263;
const NOSE_TIP = 1;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;
const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109,
];

function toDisplayedPoint(
  landmark: NormalizedLandmark,
  videoSize: Size,
  previewSize: Size,
): Point {
  const scale = Math.max(
    previewSize.width / videoSize.width,
    previewSize.height / videoSize.height,
  );
  const renderedWidth = videoSize.width * scale;
  const renderedHeight = videoSize.height * scale;
  const croppedX = (renderedWidth - previewSize.width) / 2;
  const croppedY = (renderedHeight - previewSize.height) / 2;

  return {
    x: (1 - landmark.x) * renderedWidth - croppedX,
    y: landmark.y * renderedHeight - croppedY,
  };
}

export function evaluateFacePosition(
  landmarks: NormalizedLandmark[] | undefined,
  videoSize: Size,
  previewSize: Size,
  guideRect: DOMRect,
  previewRect: DOMRect,
): CameraCondition {
  if (!landmarks?.length || !videoSize.width || !videoSize.height) {
    return { hasFace: false, isAligned: false, isFrontFacing: false };
  }

  const points = landmarks.map((landmark) =>
    toDisplayedPoint(landmark, videoSize, previewSize),
  );
  const xs = points.map(({ x }) => x);
  const ys = points.map(({ y }) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const faceWidth = maxX - minX;
  const faceHeight = maxY - minY;
  const faceCenterX = (minX + maxX) / 2;
  const faceCenterY = (minY + maxY) / 2;
  const guideCenterX = guideRect.left - previewRect.left + guideRect.width / 2;
  const guideCenterY = guideRect.top - previewRect.top + guideRect.height / 2;

  const widthRatio = faceWidth / guideRect.width;
  const heightRatio = faceHeight / guideRect.height;
  const centeredX = Math.abs(faceCenterX - guideCenterX) <= guideRect.width * 0.14;
  const centeredY = Math.abs(faceCenterY - guideCenterY) <= guideRect.height * 0.14;
  const sizeMatches =
    widthRatio >= 0.44 && widthRatio <= 0.9 && heightRatio >= 0.38 && heightRatio <= 0.9;
  const guideInset = 4;
  const guideRadius = guideRect.width / 2 - guideInset;
  const guideTop = guideCenterY - guideRect.height / 2 + guideInset;
  const guideBottom = guideCenterY + guideRect.height / 2 - guideInset;
  const topCapCenterY = guideTop + guideRadius;
  const bottomCapCenterY = guideBottom - guideRadius;
  const faceFitsInsideGuide = FACE_OVAL_INDICES.every((index) => {
    const point = points[index];
    const distanceX = Math.abs(point.x - guideCenterX);
    if (distanceX > guideRadius || point.y < guideTop || point.y > guideBottom) return false;
    if (point.y >= topCapCenterY && point.y <= bottomCapCenterY) return true;

    const capCenterY = point.y < topCapCenterY ? topCapCenterY : bottomCapCenterY;
    return distanceX ** 2 + (point.y - capCenterY) ** 2 <= guideRadius ** 2;
  });

  const leftEye = points[LEFT_EYE_OUTER];
  const rightEye = points[RIGHT_EYE_OUTER];
  const nose = points[NOSE_TIP];
  const leftCheek = points[LEFT_CHEEK];
  const rightCheek = points[RIGHT_CHEEK];
  const rawEyeAngle = Math.abs(
    Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI),
  );
  // The selfie preview mirrors the x-axis, so a level eye line can be reported
  // near 180 degrees instead of 0 degrees. Normalize both directions equally.
  const eyeAngle = Math.min(rawEyeAngle, 180 - rawEyeAngle);
  const cheekCenterX = (leftCheek.x + rightCheek.x) / 2;
  const yawOffset = Math.abs(nose.x - cheekCenterX) / Math.max(faceWidth, 1);

  return {
    hasFace: true,
    isAligned: centeredX && centeredY && sizeMatches && faceFitsInsideGuide,
    isFrontFacing: eyeAngle <= 10 && yawOffset <= 0.13,
  };
}
