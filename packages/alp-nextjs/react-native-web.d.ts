import { MouseEventHandler } from 'react';
import { ViewProps, ScrollViewProps, PerpectiveTransform } from 'react-native';

// https://github.com/necolas/react-native-web/issues/1684#issuecomment-772735882
declare module 'react-native' {
  interface PressableStateCallbackType {
    hovered?: boolean;
    focused?: boolean;
  }

  type IdRef = string;
  type IdRefList = IdRef | Array<IdRef>;

  type AnimationDirection = 'alternate' | 'alternate-reverse' | 'normal' | 'reverse';
  type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';
  type AnimationIterationCount = number | 'infinite';
  type AnimationKeyframes = string | Object;
  type AnimationPlayState = 'paused' | 'running';

  type TransformOrigin = string;
  type TransformStyle = 'flat' | 'preserve-3d';

  // https://developer.mozilla.org/fr/docs/Web/CSS/visibility#syntaxe
  type Visibility = 'visible' | 'hidden' | 'inherit' | 'collapse' | 'initial' | 'unset';

  type WebTranslate3d = { translate3d: string | undefined };

  // Based on TransformsStyle from react native
  // https://github.com/necolas/react-native-web/blob/db9df2b55f34ae03781c7e07e120c4baa4221157/packages/react-native-web/src/types/styles.js#L277
  type Transform =
    | (
        | PerpectiveTransform
        | RotateTransform
        | RotateXTransform
        | RotateYTransform
        | RotateZTransform
        | ScaleTransform
        | ScaleXTransform
        | ScaleYTransform
        | TranslateXTransform
        | TranslateYTransform
        | SkewXTransform
        | SkewYTransform
        | MatrixTransform
        | WebTranslate3d
      )[];

  // https://github.com/necolas/react-native-web/blob/db9df2b55f34ae03781c7e07e120c4baa4221157/packages/react-native-web/src/exports/View/types.js#L79
  interface ViewStyle {
    // https://github.com/necolas/react-native-web/blob/db9df2b55f34ae03781c7e07e120c4baa4221157/packages/react-native-web/src/types/styles.js#L24
    animationDelay?: string | Array<string>;
    animationDirection?: AnimationDirection | Array<AnimationDirection>;
    animationDuration?: string | Array<string>;
    animationFillMode?: AnimationFillMode | Array<AnimationFillMode>;
    animationIterationCount?: AnimationIterationCount | Array<AnimationIterationCount>;
    animationKeyframes?: AnimationKeyframes | Array<AnimationKeyframes>;
    animationPlayState?: AnimationPlayState | Array<AnimationPlayState>;
    animationTimingFunction?: string | Array<string>;
    transitionDelay?: string | Array<string>;
    transitionDuration?: string | Array<string>;
    transitionProperty?: string | Array<string>;
    transitionTimingFunction?: string | Array<string>;
    transform?: Transform;
    transformOrigin?: TransformOrigin;
    transformStyle?: TransformStyle;
    visibility?: string;
    /** web only - allow css background radiants */
    background?: string;
  }

  // https://github.com/necolas/react-native-web/blob/db9df2b55f34ae03781c7e07e120c4baa4221157/packages/react-native-web/src/exports/View/types.js#L27

  interface AccessibilityProps {
    dataSet?: Record<string, string | number | boolean>;
    accessibilityRole?: AccessibilityRole | 'paragraph' | undefined;
    accessibilityLabelledBy?: string;
    accessibilityLevel?: number;
    accessibilityHidden?: boolean;
  }

  interface ViewProps extends AccessibilityProps {
    href?: string;
    hrefAttrs?: { download?: boolean; rel?: string; target?: string };

    // https://github.com/necolas/react-native-web/blob/db9df2b55f34ae03781c7e07e120c4baa4221157/packages/react-native-web/src/exports/View/types.js#L168-L174
    onMouseDown?: MouseEventHandler<any>;
    onMouseEnter?: MouseEventHandler<any>;
    onMouseLeave?: MouseEventHandler<any>;
    onMouseMove?: MouseEventHandler<any>;
    onMouseOver?: MouseEventHandler<any>;
    onMouseOut?: MouseEventHandler<any>;
    onMouseUp?: MouseEventHandler<any>;
  }

  //github.com/necolas/react-native-web/blob/db9df2b55f34ae03781c7e07e120c4baa4221157/packages/react-native-web/src/exports/Text/types.js#L64
  interface TextProps extends ViewProps, AccessibilityProps {}

  interface FlexStyle {
    position?: 'absolute' | 'relative' | undefined | 'fixed';
  }
}
