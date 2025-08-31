import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import apiClient from "../api/axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import type { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (credentials: {
      email: string;
      password: string;
      name?: string;
    }) => apiClient.post("/auth/register", credentials),
    onSuccess: () => {
      console.log("Registration successful!");

      navigate("/login", { state: { registered: true, email: email } });
    },
    onError: (error: AxiosError<{ message?: string; errors?: any[] }>) => {
      console.error(
        "Registration failed:",
        error.response?.data?.message || "An error occurred."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ email, password, name: name || undefined });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Register Account
        </h2>
        <div>
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10" // pr-10 for button space
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full"
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </Button>
        {registerMutation.isError && (
          <p className="text-red-500 text-sm mt-2">
            {registerMutation.error.response?.data?.message ||
              "Registration failed. Please try again."}
          </p>
        )}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
