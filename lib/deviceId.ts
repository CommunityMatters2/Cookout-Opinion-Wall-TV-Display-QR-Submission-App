// Anonymous per-device id cookie name, shared between proxy.ts (which sets
// it) and the submission code paths (which read it for rate limiting).
export const DEVICE_ID_COOKIE = "cm2_device_id";
