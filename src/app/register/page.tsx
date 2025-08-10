"use client";

import React, { useState } from "react";
import { useRegisterMutation } from "@/store/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await register(form).unwrap();
      dispatch(
        setCredentials({
          user: userData.data.user,
          accessToken: userData.data.tokens.accessToken,
          refreshToken: userData.data.tokens.refreshToken,
          isAuthenticated: true,
        })
      );
      // Redirect or show success message here
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded bg-white p-6 shadow"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Register</h2>

        <label className="block mb-2 font-semibold">Name</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded border px-3 py-2"
        />

        <label className="block mb-2 font-semibold">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded border px-3 py-2"
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="mb-6 w-full rounded border px-3 py-2"
        />

        <button
          disabled={isLoading}
          type="submit"
          className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600">
            Registration failed, please try again.
          </p>
        )}
      </form>
    </div>
  );
}
