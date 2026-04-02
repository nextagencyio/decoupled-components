/**
 * Demo mode check.
 *
 * When NEXT_PUBLIC_DEMO_MODE is not set to 'false', the app runs in demo
 * mode using mock data from data/mock/ instead of querying Drupal.
 *
 * The mock client (lib/mock-client.ts) implements the same TypedClient
 * interface as the live client, so pages don't know the difference.
 */

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
}
