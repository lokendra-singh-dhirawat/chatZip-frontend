import { SidebarTrigger } from "@/components/ui/sidebar";
const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-primary shadow-sm border-b ">
      <div className="md:hid">
        <SidebarTrigger />
      </div>
      <h1 className="text-lg font-semibold bg-white">ChatZip</h1>
      <div className="space-x-4"></div>
    </header>
  );
};

export default Header;
