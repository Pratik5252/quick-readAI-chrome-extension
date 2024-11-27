import ThemeToggle from "../ui/ThemeToggle";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-4 py-4 ">
      <h1 className="text-primary text-xl font-bold">Browser Guide</h1>
      <ThemeToggle />
    </div>
  );
};

export default Header;
