import ThemeToggle from "../ui/ThemeToggle";
import Setting from "./Setting";

const Header = () => {
  return (
    <div className="sticky top-0 bg-primary-bg flex justify-between items-center px-4 py-4 ">
      <h1 className="text-primary text-xl font-bold">Quick Read AI</h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Setting />
      </div>
    </div>
  );
};

export default Header;
