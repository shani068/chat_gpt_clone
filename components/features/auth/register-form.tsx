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
import { registerSchema, type RegisterValues } from "@/lib/validations/auth.schema";
import { useSession } from "@/providers/session-provider";

export function RegisterForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await signIn({ email: values.email, name: values.name });
      toast({ title: "Account created", variant: "success" });
      router.push(ROUTES.CHAT);
    } catch {
      setSubmitError("We could not create your account. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Input
        label="Name"
        autoComplete="name"
        placeholder="Alex Rivera"
        error={errors.name?.message}
        {...register("name")}
      />

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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        {...register("password")}
      />

      {submitError ? (
        <p role="alert" className="text-caption text-destructive">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" block loading={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
        {isSubmitting ? null : <ArrowRight size={15} strokeWidth={2} aria-hidden />}
      </Button>
    </form>
  );
}
