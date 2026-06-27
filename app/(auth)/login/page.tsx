// Login page — route: /login
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      <LoginForm />
    </>
  );
}
