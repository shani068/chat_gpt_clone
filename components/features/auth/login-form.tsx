"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginValues } from "@/lib/validations/auth.schema";
import { useSession } from "@/providers/session-provider";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "alex@example.com", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const user = await signIn({ email: values.email });
      toast({ title: `Welcome back, ${user.name.split(" ")[0]}`, variant: "success" });
      router.push(ROUTES.CHAT);
    } catch {
      setSubmitError("We could not sign you in. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        hint="This demo does not check the password — any 8 characters work."
        {...register("password")}
      />

      {submitError ? (
        <p role="alert" className="text-caption text-destructive">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" block loading={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
        {isSubmitting ? null : <ArrowRight size={15} strokeWidth={2} aria-hidden />}
      </Button>
    </form>
  );
}
