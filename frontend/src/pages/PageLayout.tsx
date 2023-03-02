import Navbar from "../navigation/Navbar";

interface Props {
  children: JSX.Element;
}

const PageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
