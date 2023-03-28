import { SidebarState } from "../models/SidebarState";

interface Sidebar {
  show: SidebarState;
  showHandler: (e: SidebarState) => void;
  content: any;
}
const Sidebar: React.FC<Sidebar> = ({ show, showHandler, content }) => {
  const animation = {
    expand: "animate-slideup sm:animate-slidein",
    shrink: "animate-slidedown sm:animate-slideout",
    hide: "hidden",
  };
  return (
    <div
      className={`fixed z-10 w-full h-4/6 sm:top-0 sm:-left-96 sm:w-96 sm:h-screen sm:pt-4 bg-white ${animation[show]}`}
    >
      <div className={`p-4 w-full h-full overflow-y-auto`}>{content}</div>
      <button
        className="absolute -top-6 right-[calc(50%-24px)] sm:top-[calc(50%-24px)] sm:-right-6 bg-white rounded-t-lg sm:rounded-none sm:rounded-r-lg"
        onClick={() => {
          showHandler(show === "expand" ? "shrink" : "expand");
        }}
      >
        <div
          className={`${
            show === "expand"
              ? "bg-downarrow sm:bg-leftarrow"
              : "bg-uparrow sm:bg-rightarrow"
          } bg-[length:16px_16px] bg-center bg-no-repeat w-12 h-6 sm:w-6 sm:h-12`}
        ></div>
      </button>
    </div>
  );
};

export default Sidebar;
