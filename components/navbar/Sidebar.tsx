import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

const Sidebar = () => {
  return (
    <Card className="h-full w-20">
      <Button variant={"ghost"}><Link href="/">Home</Link></Button>
      <Button variant={"ghost"}><Link href="/profile">Profile</Link></Button>
    </Card>
  );
};

export default Sidebar;
