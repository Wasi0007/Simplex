"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Nav = () => {
  const handleSignOut = () => {
    // Clear the token and email from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");

    // Redirect to login page
    window.location.href = "/login";  // Redirecting to login page after sign out
  };

  return (
    <header className="p-2">
      <ul className="flex justify-end">
        <li>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                {/* Link to Login page or just call handleSignOut */}
                <button
                  onClick={handleSignOut}
                  className={navigationMenuTriggerStyle()}
                >
                  Sign Out
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </li>
      </ul>
    </header>
  );
};

export default Nav;
