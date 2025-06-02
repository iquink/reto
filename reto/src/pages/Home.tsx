import React from "react";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";
import { Select } from "@components/index";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const Home: React.FC = observer(() => {
  const { authStore, settingsStore } = useStore();
  const { t } = useTranslation();

  const onLanguageChange = (value: string) => {
    console.log("Selected language:", value);
  };

  console.log("Current i18next language:", i18next.language);

  return (
    <div>
      <p>{t("welcome")}</p>
      <p>current language: {settingsStore.currentLanguage}</p>
      <p>
        {authStore.user
          ? `User: ${authStore.user.username} (${authStore.user.email})`
          : "No user logged in"}
      </p>
      <Select
        name="options"
        aria-label="Select an option"
        onSelectionChange={(e) => onLanguageChange(String(e))}
        defaultSelectedKey={"1"}
        options={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ]}
        onChange={(value) => console.log("Selected:", value)}
      />
    </div>
  );
});

export default Home;
