import ResetPasswordPage from "@/features/reset-password";

const ResetPassword = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  return <ResetPasswordPage token={await params.then((res) => res.token)} />;
};

export default ResetPassword;
