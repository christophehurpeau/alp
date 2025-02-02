import {
  createAlouetteTamagui,
  createAlouetteThemes,
  createAlouetteTokens,
  defaultColorScales,
} from "alouette/createAlouetteTamagui";

const tokens = createAlouetteTokens(defaultColorScales);
const themes = createAlouetteThemes(tokens);

export default createAlouetteTamagui(tokens, themes, {});
