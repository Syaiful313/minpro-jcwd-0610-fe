"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs } from "@/components/ui/tabs";
import useRegister from "@/hooks/api/auth/useRegister";
import { useFormik } from "formik";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { registerSchema } from "./schemas";

export default function RegisterPage() {
  const { mutateAsync: register, isPending } = useRegister();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      referralCode: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <div className="container mx-auto my-14 flex w-full items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex justify-center">
            <Calendar className="text-primary h-10 w-10" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your information below to create your account
          </p>
        </div>
        <Tabs>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Sign Up</CardTitle>
              <CardDescription>
                <p className="my-2">
                  Enter your email and password to create your account
                </p>
              </CardDescription>
            </CardHeader>
            <form onSubmit={formik.handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    className="w-full"
                  />
                  {!!formik.touched.fullName && !!formik.errors.fullName && (
                    <p className="text-destructive text-sm">
                      {formik.errors.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    className="w-full"
                  />
                  {!!formik.touched.email && !!formik.errors.email && (
                    <p className="text-destructive text-sm">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                      className="w-full pr-12"
                    />
                    {!!formik.touched.password && !!formik.errors.password && (
                      <p className="text-destructive text-sm">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="referralCode">Referral Code</Label>
                  <Input
                    id="referralCode"
                    name="referralCode"
                    placeholder="fullname123 "
                    value={formik.values.referralCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full"
                  />
                  <p className="text-muted-foreground my-2 text-xs">
                    Enter a referral code to get a discount on your first event
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Loading..." : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Tabs>
        <p className="text-muted-foreground px-4 text-center text-xs sm:text-sm">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
