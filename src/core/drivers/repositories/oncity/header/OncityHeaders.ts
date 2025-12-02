export function buildOncityHeaders(appKey: string, appToken: string) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-VTEX-API-AppKey': appKey,
    'X-VTEX-API-AppToken': appToken,
  };
}
