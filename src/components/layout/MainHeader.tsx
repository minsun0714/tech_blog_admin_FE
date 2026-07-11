import ApiKeyInputBar from "@/components/api-key/ApiKeyInputBar";
import { Hamburger } from "lucide-react";

export default function MainHeader({
  isHamburgerOpen,
  setIsHamburgerOpen,
}: {
  isHamburgerOpen: boolean;
  setIsHamburgerOpen: (isOpen: boolean) => void;
}) {
  return (
    <header className="mb-6 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
          onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
        >
          <Hamburger size={20} />
        </button>
        <div>
          <ApiKeyInputBar />
        </div>
      </div>
    </header>
  );
}
