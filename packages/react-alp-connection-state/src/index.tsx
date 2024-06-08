import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { DimensionValue, ScaledSize } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  // eslint-disable-next-line import/no-unresolved -- react-native-web or react-native
} from "react-native";

const defaultTheme = {
  container: {
    backgroundColor: "rgba(247, 25, 0, 0.8)",
    color: "#fff",
    textShadowColor: "#111",
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 1,
  },
  backgroundColorConnected: "rgba(25, 200, 60, 0.8)",
};

export type ConnectionStateTheme = typeof defaultTheme;
export type State = "connected" | "connecting" | "disconnected" | null;

export interface ConnectionStateProps {
  theme?: ConnectionStateTheme;
  forceHidden?: boolean;
  state: State;
  children: NonNullable<ReactNode>;
}

const zDepth1 =
  "0 2px 3px 0 rgba(0, 0, 0, 0.15), 0 2px 5px 0 rgba(0, 0, 0, 0.2)";

type CreateCalc = (
  webCalc: string,
  createCalc: (dimensions: ScaledSize) => DimensionValue,
) => DimensionValue;

const useCreateCalcNative = (): CreateCalc => {
  const dimensions = useWindowDimensions();
  return (webCalc, createCalc) => createCalc(dimensions);
};
const useCreateCalcWeb = (): CreateCalc => {
  return (webCalc) => `calc(${webCalc})` as DimensionValue;
};
const useCreateCalc =
  Platform.OS === "web" ? useCreateCalcWeb : useCreateCalcNative;

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
    boxShadow: zDepth1,
    zIndex: 9,
    transition: "top .8s, background-color .2s",
  },
  hide: {
    top: -24,
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
    transition: "background-color .2s",
  },
});

export function ConnectionState({
  theme,
  forceHidden,
  state,
  children,
}: ConnectionStateProps): ReactElement | null {
  const unloadingRef = useRef<boolean>(false);

  const createCalc = useCreateCalc();
  const left = createCalc("50% - 100px", ({ width }) => width / 2 - 100); // TODO use calc() in web ?

  useEffect((): (() => void) | undefined => {
    if (typeof window === "undefined") return;

    const beforeUnloadHandler = (): void => {
      unloadingRef.current = true;
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);

    return (): void => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const shouldHide = forceHidden || !state || state === "connected";

  return (
    <View
      style={[
        styles.connectionStateContainer,
        shouldHide && styles.hide,
        theme?.container,
        state === "connected" && {
          backgroundColor: (theme || defaultTheme).backgroundColorConnected,
        },
      ]}
    >
      {!state ? null : (
        <Text
          style={[
            styles.connectionStateText,
            theme && { backgroundColor: theme.container.backgroundColor },
            state === "connected" && {
              backgroundColor: (theme || defaultTheme).backgroundColorConnected,
            },
            { left },
          ]}
        >
          {children}
        </Text>
      )}
    </View>
  );
}
