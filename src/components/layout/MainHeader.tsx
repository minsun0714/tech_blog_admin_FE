import ApiKeyInputBar from "@/components/api-key/ApiKeyInputBar";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound, Menu } from "lucide-react";

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
          type="button"
          aria-label={isHamburgerOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-controls="admin-sidebar"
          aria-expanded={isHamburgerOpen}
          className="rounded-lg p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
          onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-800">Tech Blog Admin</p>
          <p className="text-xs text-slate-500">콘텐츠 관리 콘솔</p>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm">
                <KeyRound />
                API Key 설정
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>API Key 설정</DialogTitle>
              <DialogDescription>
                관리 API 요청에 사용할 키를 현재 브라우저 세션에 저장합니다.
              </DialogDescription>
            </DialogHeader>
            <ApiKeyInputBar />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
