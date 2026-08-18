const PENDING_ONBOARDING_SKIN_IMAGE_ID_KEY = 'pendingOnboardingSkinImageId';

export function getPendingOnboardingSkinImageId() {
  const storedValue = localStorage.getItem(PENDING_ONBOARDING_SKIN_IMAGE_ID_KEY);
  if (!storedValue) return null;

  const skinImageId = Number(storedValue);
  return Number.isInteger(skinImageId) && skinImageId > 0 ? skinImageId : null;
}

export function setPendingOnboardingSkinImageId(skinImageId: number) {
  localStorage.setItem(PENDING_ONBOARDING_SKIN_IMAGE_ID_KEY, String(skinImageId));
}

export function clearPendingOnboardingSkinImageId() {
  localStorage.removeItem(PENDING_ONBOARDING_SKIN_IMAGE_ID_KEY);
}
