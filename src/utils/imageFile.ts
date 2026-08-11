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
