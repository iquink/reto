import React from "react";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";
import { Select } from "@components/index";
import { useTranslation } from "react-i18next";

const Home: React.FC = observer(() => {
  const { authStore, settingsStore } = useStore();
  const { t } = useTranslation();

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
        label="Select an option"
        name="options"
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        onChange={(value) => console.log("Selected:", value)}
      />
    </div>
  );
});

export default Home;
