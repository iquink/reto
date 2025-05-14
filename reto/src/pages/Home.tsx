import React from "react";
import {useStore} from "@store";

const Home: React.FC = () => {
  const { authStore } = useStore();

  return (
    <div>
      <p>Welcome to the Home Page!</p>
      <p>
        {authStore.user
          ? `User: ${authStore.user.name} (${authStore.user.email})`
          : "No user logged in"}
      </p>
    </div>
  );
};

export default Home;
