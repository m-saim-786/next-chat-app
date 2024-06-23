"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { User } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";

const SignUpSchema = z.object({
  email: z.string().email(),
  name: z.string(),
}) satisfies z.Schema<Omit<User, "id">>;

const SignUpForm = () => {
  const [formData, setFormData] = useState<Omit<User, "id">>({
    email: "",
    name: "",
  });

  const signUp = async (data: Omit<User, "id">) => {
    try {
      await fetch("/api/auth/signUp", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json());
      toast({
        title: "Success",
        description: "Account created successfully.",
      });
      redirect("/signIn");
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = SignUpSchema.parse(formData);
    await signUp(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="w-[30rem] p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-center">Sign Up</h3>
        <Input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
      <div className="mt-3">
        {"Already have an account?"} <Link href="/signIn">Sign In</Link>
      </div>
    </Card>
  );
};

export default SignUpForm;
