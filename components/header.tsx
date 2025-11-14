"use client";

import { HeaderLogo } from "./header-logo";
import { NavLinks } from "./nav-links";
import { CartIcon } from "./cart-icon";
import { AccountMenu } from "./account-menu";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="w-full bg-black-primary border-b border-border">
      {/* Row 1: Logo */}
      <div className="border-b border-border px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-center">
        <HeaderLogo />
      </div>

      {/* Row 2: Navigation, Cart, Account */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-4 sticky top-0 bg-black-primary z-10">
        <div className="hidden md:block">
          <NavLinks />
        </div>

        <div className="sm:hidden flex w-full justify-between items-center gap-4 sm:gap-8 ml-auto">
          <MobileNav />

          <div className="sm:flex hidden items-center gap-4">
            <CartIcon />
            <AccountMenu />
          </div>
        </div>
        <div className="flex w-fit justify-between items-center gap-4 sm:gap-8 ml-auto">
          <CartIcon />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
