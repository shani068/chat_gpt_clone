// Register page — route: /register
import { RegisterForm } from "@/components/features/auth/register-form";

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Create account</h1>
      <RegisterForm />
    </>
  );
}
