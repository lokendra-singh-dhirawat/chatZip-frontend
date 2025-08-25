import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-3xl text-gray-500">Page not found</p>
        </div>
        <Button asChild>
          <Link to="/" className="text-xl text-blue-500">
            Go back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
