"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
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
import { ResetPasswordSchema } from "./schemas";
import useResetPassword from "@/hooks/api/auth/useResetPassword";

interface ResetPasswordPageProps {
  token: string;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  token,
}) => {
  const { mutateAsync: resetPassword, isPending } = useResetPassword(token);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      await resetPassword(values);
    },
  });

  return (
    <div className="container mx-auto my-28 flex w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Calendar className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-muted-foreground text-sm">
            Create a new password for your account
          </p>
        </div>

        <Card>
          <form onSubmit={formik.handleSubmit}>
            <CardHeader>
              <CardTitle>Create new password</CardTitle>
              <CardDescription className="py-4">
                Please enter a new password for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {!!formik.errors.password && !!formik.touched.password && (
                    <span className="text-xs text-rose-500">
                      {formik.errors.password}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {!!formik.errors.confirmPassword &&
                    !!formik.touched.confirmPassword && (
                      <span className="text-xs text-rose-500">
                        {formik.errors.confirmPassword}
                      </span>
                    )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="my-4 w-full"
                disabled={isPending}
              >
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-muted-foreground px-8 text-center text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
