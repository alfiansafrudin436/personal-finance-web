import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

/**
 * Tracks the mobile breakpoint through useSyncExternalStore rather than an
 * effect that sets state on mount: the subscription model reads the current
 * value during render, so there is no extra render pass and no mismatch
 * between the first paint and the real viewport.
 */
const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// On the server there is no viewport; desktop is the safer default because the
// sidebar renders inline rather than inside a sheet.
const getServerSnapshot = () => false;

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
