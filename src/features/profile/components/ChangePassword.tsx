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
import useUpdatePassword from "@/hooks/api/profile/useUpdatePassword";
import { showToast } from "@/utils/toastUtils";
import { useFormik } from "formik";
import { FC } from "react";
import { ChangePasswordSchema } from "../schemas";

interface ChangePasswordProps {
  token: string;
}

const ChangePassword: FC<ChangePasswordProps> = () => {
  const updatePassword = useUpdatePassword();

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: async (values) => {
      try {
        await updatePassword.mutateAsync({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        passwordFormik.resetForm();
        showToast.success("Password updated successfully");
      } catch (err: any) {
        showToast.error(
          err.response?.data?.message || "Failed to update password",
        );
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password or reset it if you've forgotten it
        </CardDescription>
      </CardHeader>
      <form onSubmit={passwordFormik.handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...passwordFormik.getFieldProps("currentPassword")}
            />
            {passwordFormik.touched.currentPassword &&
            passwordFormik.errors.currentPassword ? (
              <p className="text-xs text-red-500">
                {passwordFormik.errors.currentPassword}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...passwordFormik.getFieldProps("newPassword")}
            />
            {passwordFormik.touched.newPassword &&
            passwordFormik.errors.newPassword ? (
              <p className="text-xs text-red-500">
                {passwordFormik.errors.newPassword}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Password must be at least 8 characters
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...passwordFormik.getFieldProps("confirmPassword")}
            />
            {passwordFormik.touched.confirmPassword &&
            passwordFormik.errors.confirmPassword ? (
              <p className="text-xs text-red-500">
                {passwordFormik.errors.confirmPassword}
              </p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            className="my-4"
            disabled={updatePassword.isPending || !passwordFormik.isValid}
          >
            {updatePassword.isPending ? "Changing..." : "Change Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ChangePassword;
