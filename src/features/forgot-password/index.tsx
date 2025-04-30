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
import useForgotPassword from "@/hooks/api/auth/useForgotPassword";
import { useFormik } from "formik";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { forgotPasswordSchema } from "./schemas";

export default function ForgotPasswordPage() {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      await forgotPassword(values);
    },
  });
  
  return (
    <div className="container mx-auto my-32 flex w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Calendar className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <Card>
          <form onSubmit={formik.handleSubmit}>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription className="my-4">
                Enter your email address below and we'll send you instructions
                to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="my-4 w-full"
                disabled={isPending}
              >
                {isPending ? "Sending email..." : "Send email"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-muted-foreground px-8 text-center text-sm">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
