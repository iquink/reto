import React from "react";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";

const Profile: React.FC = observer(() => {
  const { authStore } = useStore();

  if (!authStore.user) {
    return <p>No user data available. Please log in.</p>;
  }

  const { name, email } = authStore.user;

  return (
    <div>
      <h1>User Profile</h1>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
});

export default Profile;