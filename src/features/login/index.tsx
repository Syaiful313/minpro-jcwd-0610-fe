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
import { useFormik } from "formik";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { loginSchema } from "./schemas";
import useLogin from "@/hooks/api/auth/useLogin";

export default function LoginPage() {
  const { mutateAsync: login, isPending } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Calendar className="text-primary h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your credentials to sign in to your account
          </p>
        </div>

        <Card className="w-full shadow-lg">
          <form onSubmit={formik.handleSubmit}>
            <CardHeader className="space-y-2">
              <CardTitle className="text-center text-2xl">Sign In</CardTitle>
              <CardDescription className="py-4 text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm font-medium">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-primary text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="my-4 w-full"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
