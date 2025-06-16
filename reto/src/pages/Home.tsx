import React from "react";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";

const Home: React.FC = observer(() => {
  const { authStore } = useStore();

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
