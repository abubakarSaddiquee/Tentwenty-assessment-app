"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { HERO_CONTENT } from "./data";
import { useSignin } from "./useSignin";

export default function SignIn() {
  const { register, handleSubmit, errors, isSubmitting, serverError } = useSignin();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[var(--color-surface)] px-4 sm:px-8 py-10 sm:py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] mb-6 sm:mb-8">
            Welcome back
          </h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberMe" className="text-sm text-[var(--color-text-secondary)] cursor-pointer">
                Remember me
              </label>
            </div>

            {serverError && (
              <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger-bg)] px-3 py-2 rounded-lg">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full mt-1"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel — Hero */}
      <div className="hidden lg:flex flex-1 flex-col items-start justify-center bg-[var(--color-primary)] px-12 py-12">
        <h2 className="text-4xl font-bold text-[var(--color-surface)] mb-5">
          {HERO_CONTENT.appName}
        </h2>
        <p className="text-[var(--color-surface-soft)] text-base leading-relaxed max-w-md">
          {HERO_CONTENT.description}
        </p>
      </div>
    </div>
  );
}
