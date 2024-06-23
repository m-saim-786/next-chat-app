import React from "react";
import { Card, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const { handleLogout } = useAuth();

  return (
    <Card className="h-full w-20 flex flex-col justify-between py-5">
      <div className="flex flex-col gap-3">
        <Button variant={"ghost"}>
          <Link href="/">Home</Link>
        </Button>
        <Button variant={"ghost"}>
          <Link href="/chat">Chat</Link>
        </Button>
      </div>

      <Button variant={"ghost"} onClick={handleLogout}>
        Log out
      </Button>
    </Card>
  );
};

export default Sidebar;
