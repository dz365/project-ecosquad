import { SidebarState } from "../models/SidebarState";

interface Sidebar {
  show: SidebarState;
  showHandler: (e: SidebarState) => void;
  content: any;
}
const Sidebar: React.FC<Sidebar> = ({ show, showHandler, content }) => {
  const animation = {
    expand: "animate-slideup md:animate-slidein",
    shrink: "animate-slidedown md:animate-slideout",
    hide: "hidden",
  };
  return (
    <div
      className={`fixed z-10 w-full h-4/6 md:top-0 md:-left-96 md:w-96 md:h-screen bg-white ${animation[show]}`}
    >
      <button
        className="absolute -top-6 right-[calc(50%-24px)] md:top-[calc(50%-24px)] md:-right-6 bg-white rounded-t-lg md:rounded-none md:rounded-r-lg"
        onClick={() => {
          showHandler(show === "expand" ? "shrink" : "expand");
        }}
      >
        <div
          className={`${
            show
              ? "bg-downarrow md:bg-leftarrow"
              : "bg-uparrow md:bg-rightarrow"
          } bg-[length:16px_16px] bg-center bg-no-repeat w-12 h-6 md:w-6 md:h-12`}
        ></div>
      </button>
      {content}
    </div>
  );
};

export default Sidebar;
