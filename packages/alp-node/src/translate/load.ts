import IntlMessageFormatDefault from "intl-messageformat";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const IntlMessageFormat: typeof IntlMessageFormatDefault =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (IntlMessageFormatDefault as any).default || IntlMessageFormatDefault;

export type Translations = Readonly<Record<string, IntlMessageFormatDefault>>;

export default function load(
  translations: Readonly<Record<string, unknown>>,
  language: string,
): Translations {
  const result: Record<string, IntlMessageFormatDefault> = {};

  (function loadMap(record: Record<string, unknown>, prefix: string) {
    Object.entries(record).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        loadMap(value as Record<string, unknown>, `${prefix}${key}.`);
        return;
      }

      result[`${prefix}${key}`] = new IntlMessageFormat(
        value as string,
        language,
      );
    });
  })(translations, "");

  return result;
}
