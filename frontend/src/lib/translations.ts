export type LanguageCode = "hi" | "en" | "te" | "ta" | "bn" | "mr";

import enJson from "../locales/en.json";
import hiJson from "../locales/hi.json";
import teJson from "../locales/te.json";
import taJson from "../locales/ta.json";
import bnJson from "../locales/bn.json";
import mrJson from "../locales/mr.json";

export type TranslationDict = typeof enJson;

export const translations: Record<LanguageCode, TranslationDict> = {
  en: enJson,
  hi: hiJson,
  te: teJson,
  ta: taJson,
  bn: bnJson,
  mr: mrJson,
};
