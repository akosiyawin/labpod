"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { useAudio } from "@/providers/AudioProvider";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { audio } = useAudio();

  const { signOut } = useClerk();

  return (
    <section
      className={cn("left_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <nav className="flex flex-col gap-6">
        <Link
          href={"/"}
          className="flex cursor-pointer items-center gap-1 pb-10 justify-center lg:justify-start"
        >
          <Image src={"/icons/logo.svg"} alt="Logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-md:hidden">
            Labpod
          </h1>
        </Link>

        {sidebarLinks.map(({ imgURL, label, route }) => {
          const isActive =
            pathname === route || pathname.startsWith(`${route}/`);
          return (
            <Link
              href={route}
              key={route}
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
                {
                  "bg-nav-focus border-r-4 border-primary-1": isActive,
                }
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button className="text-16 w-full bg-primary-1 font-extrabold">
            <Link href={"/sign-in"}>Sign in</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-16 w-full bg-primary-1 font-extrabold"
            onClick={() => signOut(() => router.push("/"))}
          >
            Sign Out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
