import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AppProps } from "../../base/types";
import { MenuBar } from "@/components/layout/MenuBar";
import { Favorite } from "@/utils/storage";

interface InternetExplorerMenuBarProps extends Omit<AppProps, "onClose"> {
  onRefresh?: () => void;
  onStop?: () => void;
  onGoToUrl?: () => void;
  onHome?: () => void;
  onClearHistory?: () => void;
  onShowHelp?: () => void;
  onShowAbout?: () => void;
  isLoading?: boolean;
  favorites?: Favorite[];
  onAddFavorite?: () => void;
  onClearFavorites?: () => void;
  onNavigateToFavorite?: (url: string) => void;
  onFocusUrlInput?: () => void;
  onClose?: () => void;
}

export function InternetExplorerMenuBar({
  onRefresh,
  onStop,
  onHome,
  onShowHelp,
  onShowAbout,
  isLoading,
  favorites = [],
  onAddFavorite,
  onClearFavorites,
  onNavigateToFavorite,
  onFocusUrlInput,
  onClose,
}: InternetExplorerMenuBarProps) {
  return (
    <MenuBar>
      {/* File Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 text-md px-2 py-1 border-none hover:bg-gray-200 active:bg-gray-900 active:text-white focus-visible:ring-0"
          >
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onFocusUrlInput}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            Go to URL
          </DropdownMenuItem>

          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onClose}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            Close Window
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 px-2 py-1 text-md focus-visible:ring-0 hover:bg-gray-200 active:bg-gray-900 active:text-white"
          >
            Edit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onRefresh}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            Refresh
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onStop}
            disabled={!isLoading}
            className={
              !isLoading
                ? "text-gray-400 text-md h-6 px-3"
                : "text-md h-6 px-3 active:bg-gray-900 active:text-white"
            }
          >
            Stop
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Favorites Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 px-2 py-1 text-md focus-visible:ring-0 hover:bg-gray-200 active:bg-gray-900 active:text-white"
          >
            Favorites
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onHome}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            Go Home
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onAddFavorite}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            Add to Favorites...
          </DropdownMenuItem>
          {favorites.length > 0 && (
            <>
              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
              {favorites.map((favorite) => (
                <DropdownMenuItem
                  key={favorite.url}
                  onClick={() => onNavigateToFavorite?.(favorite.url)}
                  className="text-md h-6 px-3 active:bg-gray-900 active:text-white flex items-center gap-2"
                >
                  <img
                    src={favorite.favicon || "/icons/ie-site.png"}
                    alt=""
                    className="w-4 h-4"
                    onError={(e) => {
                      e.currentTarget.src = "/icons/ie-site.png";
                    }}
                  />
                  {favorite.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
              <DropdownMenuItem
                onClick={onClearFavorites}
                className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
              >
                Clear Favorites...
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="h-6 px-2 py-1 text-md focus-visible:ring-0 hover:bg-gray-200 active:bg-gray-900 active:text-white"
          >
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={1} className="px-0">
          <DropdownMenuItem
            onClick={onShowHelp}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            Get Help
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[2px] bg-black my-1" />
          <DropdownMenuItem
            onClick={onShowAbout}
            className="text-md h-6 px-3 active:bg-gray-900 active:text-white"
          >
            About Internet Explorer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MenuBar>
  );
}
