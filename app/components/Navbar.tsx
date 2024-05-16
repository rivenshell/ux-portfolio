"use client"
import React from "react"
//  import shadcn navbar
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

const Navbar = () => {
  return (
    <>
      <main className=" flex justify-center items-center pt-8">
        {/* organize this */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>Testing</NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Work</NavigationMenuTrigger>
              <NavigationMenuContent className=" flex justify-center items-center">
                <NavigationMenuLink>Taco Store</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuLink>Get in Touch</NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </main>
    </>
  )
}

export default Navbar
