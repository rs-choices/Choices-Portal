'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

// False on the server and during hydration, true in the browser after that.
// Anything that depends on "today" or "now" waits for it, so the server's
// date and timezone never disagree with the browser's.
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
