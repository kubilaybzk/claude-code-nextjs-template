export function usePermission() {
  return {
    isAdmin: true,
    hasAll: () => true,
    hasAny: () => true,
  }
}
