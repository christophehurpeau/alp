globalThis.matchMedia =
  globalThis.matchMedia ||
  function matchMediaPolyfill() {
    return {
      matches: false,
    };
  };
