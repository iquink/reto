import React from "react";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";
import i18next from "i18next";

const Home: React.FC = observer(() => {
  const { authStore } = useStore();

  console.log("Current i18next language:", i18next.language);

  return (
    <div>
      <p>
        {authStore.user
          ? `User: ${authStore.user.username} (${authStore.user.email})`
          : "No user logged in"}
      </p>
    </div>
  );
});

export default Home;
