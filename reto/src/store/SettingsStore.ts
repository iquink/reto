import { types } from "mobx-state-tree";
import { Language, LanguageEnumModel } from "./models";

export const SettingsStore = types
  .model("SettingsStore", {
    currentLanguage: types.optional(LanguageEnumModel, Language.EN),
  })
  .actions((self) => ({
    setLanguage(lang: Language) {
      self.currentLanguage = lang;
    },
  }));