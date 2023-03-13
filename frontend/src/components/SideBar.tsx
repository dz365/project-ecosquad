interface SideBar {
  width: string;
  zIndex: number;
  reveal: "show" | "hide" | "";
  children: JSX.Element;
}

const SideBar: React.FC<SideBar> = ({ width, zIndex, reveal, children }) => {
  return (
    <div
      className={`fixed top-0 h-screen bg-white ${
        reveal === "show" && "animate-slidein"
      } ${reveal === "hide" && "animate-slideout"}`}
      style={{ width: width, left: "-" + width, zIndex: zIndex }}
    >
      <>{children}</>
    </div>
  );
};
export default SideBar;
