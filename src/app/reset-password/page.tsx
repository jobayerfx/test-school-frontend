"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useResetPasswordMutation } from "@/store/apiSlice";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();

  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (!token) setErrorMsg("Invalid or missing reset token.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setErrorMsg("");

    try {
      await resetPassword({ token, password }).unwrap();
    } catch {
      // error handled by RTK Query state
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded bg-white p-6 shadow"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Reset Password</h2>

        {errorMsg && <p className="mb-4 text-center text-red-600">{errorMsg}</p>}

        <label className="block mb-2 font-semibold">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded border px-3 py-2"
          minLength={6}
        />

        <label className="block mb-2 font-semibold">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mb-6 w-full rounded border px-3 py-2"
          minLength={6}
        />

        <button
          disabled={isLoading || !!errorMsg}
          type="submit"
          className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600">Failed to reset password.</p>
        )}
        {isSuccess && (
          <p className="mt-4 text-center text-green-600">Password reset successfully!</p>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
