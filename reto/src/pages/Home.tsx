import React from "react";
import rootStore from "@store/index";

const Home: React.FC = () => {
  const { authStore } = rootStore;

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
