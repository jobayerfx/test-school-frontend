"use client";

import React, { useState } from "react";
import { useForgotPasswordMutation } from "@/store/apiSlice";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, error, isSuccess }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
    } catch {
      // Error handled by RTK Query state
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded bg-white p-6 shadow"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Forgot Password</h2>

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-6 w-full rounded border px-3 py-2"
        />

        <button
          disabled={isLoading}
          type="submit"
          className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600">Failed to send reset link.</p>
        )}
        {isSuccess && (
          <p className="mt-4 text-center text-green-600">Reset link sent! Check your email.</p>
        )}
      </form>
    </div>
  );
}
