import { useRef, useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View, Text } from 'react-native';
import { jsx } from 'react/jsx-runtime';

const defaultTheme = {
  container: {
    backgroundColor: "rgba(247, 25, 0, 0.8)",
    color: "#fff",
    textShadowColor: "#111",
    textShadowOffset: {
      width: 0,
      height: -1
    },
    textShadowRadius: 1
  },
  backgroundColorConnected: "rgba(25, 200, 60, 0.8)"
};
const useCreateCalcNative = () => {
  const dimensions = useWindowDimensions();
  return (webCalc, createCalc) => createCalc(dimensions);
};
const useCreateCalcWeb = () => {
  return webCalc => `calc(${webCalc})`;
};
const useCreateCalc = Platform.OS === "web" ? useCreateCalcWeb : useCreateCalcNative;

// example: const left = createCalc('50% - 100px', ({ width }) => width / 2 - 100);

const styles = StyleSheet.create({
  connectionStateContainer: {
    backgroundColor: defaultTheme.container.backgroundColor,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 2,
    color: defaultTheme.container.color,
    textShadowOffset: defaultTheme.container.textShadowOffset,
    textShadowRadius: defaultTheme.container.textShadowRadius,
    boxShadow: "0 2px 3px 0 rgba(0, 0, 0, 0.15), 0 2px 5px 0 rgba(0, 0, 0, 0.2)",
    zIndex: 9,
    transition: "top .8s, background-color .2s"
  },
  hide: {
    top: -24
  },
  connectionStateText: {
    backgroundColor: defaultTheme.container.backgroundColor,
    position: "absolute",
    width: 200,
    height: 22,
    lineHeight: 22,
    top: 2,
    textAlign: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    transition: "background-color .2s"
  }
});
function ConnectionState({
  theme,
  forceHidden,
  state,
  children
}) {
  const unloadingRef = useRef(false);
  const createCalc = useCreateCalc();
  const left = createCalc("50% - 100px", ({
    width
  }) => width / 2 - 100); // TODO use calc() in web ?

  useEffect(() => {
    if (typeof globalThis === "undefined") return;
    const beforeUnloadHandler = () => {
      unloadingRef.current = true;
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  return /*#__PURE__*/jsx(View, {
    style: [styles.connectionStateContainer, (forceHidden || !state || state === "connected") && styles.hide, theme == null ? undefined : theme.container, state === "connected" && {
      backgroundColor: (theme || defaultTheme).backgroundColorConnected
    }],
    children: !state ? null : /*#__PURE__*/jsx(Text, {
      style: [styles.connectionStateText, theme && {
        backgroundColor: theme.container.backgroundColor
      }, state === "connected" && {
        backgroundColor: (theme || defaultTheme).backgroundColorConnected
      }, {
        left
      }],
      children: children
    })
  });
}

export { ConnectionState };
//# sourceMappingURL=index-browser.es.js.map
