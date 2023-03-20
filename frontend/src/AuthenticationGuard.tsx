import { withAuthenticationRequired } from "@auth0/auth0-react";
import { ComponentType } from "react";

interface AuthenticationGuardProps {
  component: ComponentType;
}

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <p>loading</p>,
  });
  return <Component />;
};

export default AuthenticationGuard;
