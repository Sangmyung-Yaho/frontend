const MAX_UPLOAD_IMAGE_DIMENSION = 1600;
const MAX_UPLOAD_IMAGE_BYTES = 900 * 1024;
const JPEG_QUALITY_STEPS = [0.85, 0.8, 0.75, 0.7, 0.65] as const;

export function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('이미지 미리보기를 만들지 못했습니다.'));
    });
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function loadImage(imageBlob: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const imageUrl = URL.createObjectURL(imageBlob);
    const image = new Image();

    image.addEventListener('load', () => {
      URL.revokeObjectURL(imageUrl);
      resolve(image);
    });
    image.addEventListener('error', () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('업로드할 이미지를 불러오지 못했습니다.'));
    });
    image.src = imageUrl;
  });
}

function encodeCanvasAsJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (imageBlob) => {
        if (imageBlob) {
          resolve(imageBlob);
          return;
        }
        reject(new Error('업로드할 이미지를 압축하지 못했습니다.'));
      },
      'image/jpeg',
      quality,
    );
  });
}

export async function prepareImageForUpload(imageBlob: Blob) {
  const image = await loadImage(imageBlob);
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, MAX_UPLOAD_IMAGE_DIMENSION / longestSide);

  if (
    imageBlob.type === 'image/jpeg' &&
    imageBlob.size <= MAX_UPLOAD_IMAGE_BYTES &&
    scale === 1
  ) {
    return imageBlob;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('업로드할 이미지를 처리하지 못했습니다.');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let compressedImage: Blob | null = null;
  for (const quality of JPEG_QUALITY_STEPS) {
    compressedImage = await encodeCanvasAsJpeg(canvas, quality);
    if (compressedImage.size <= MAX_UPLOAD_IMAGE_BYTES) {
      break;
    }
  }

  if (!compressedImage) {
    throw new Error('업로드할 이미지를 압축하지 못했습니다.');
  }

  return compressedImage;
}
