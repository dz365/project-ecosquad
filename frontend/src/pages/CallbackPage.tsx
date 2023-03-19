import { useAuth0 } from "@auth0/auth0-react";
import PageLayout from "./PageLayout";

const CallbackPage = () => {
  const { error } = useAuth0();

  if (error) {
    return (
      <PageLayout>
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div></div>
    </PageLayout>
  );
};

export default CallbackPage;
