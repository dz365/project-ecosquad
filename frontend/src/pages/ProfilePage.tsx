import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PageLayout from "./PageLayout";
import { testAPIEndpoint } from "../service/test.service";

const ProfilePage = () => {
  const [testAPIMessage, setTestAPIMessage] = useState("");
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let isMounted = true;

    const getMessage = async () => {
      const accessToken = await getAccessTokenSilently();
      const data = await testAPIEndpoint(accessToken);

      if (!isMounted) {
        return;
      }

      setTestAPIMessage(JSON.stringify(data, null, 2));
    };

    getMessage();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div>
        <h1>Test API endpoint</h1>
        <p>{testAPIMessage}</p>
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
        <p>{JSON.stringify(user, null, 2)}</p>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
