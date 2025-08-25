import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import apiClient from "../api/axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import type { AxiosError } from "axios";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) => (
  <div>
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <div className="relative mt-1">
      <Input
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        required
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
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
);

const ChangePasswordForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const changePasswordMutation = useMutation({
    mutationFn: (credentials: {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => apiClient.post("/auth/change-password", credentials),
    onSuccess: () => {
      console.log("Password changed successfully!");
      setSuccessMessage(
        "Your password has been updated successfully! Redirecting..."
      );
      setErrorMessage(null);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (
      error: AxiosError<{
        message?: string;
        errorCode?: string;
        errors?: any[];
      }>
    ) => {
      const backendMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      const backendErrors = error.response?.data?.errors;

      console.error(
        "Password change failed:",
        backendMessage,
        "Errors:",
        backendErrors
      );

      let displayMessage = backendMessage;
      if (backendErrors && backendErrors.length > 0) {
        displayMessage = backendErrors.map((err) => err.message).join(" | ");
      } else if (error.response?.data?.errorCode === "INCORRECT_OLD_PASSWORD") {
        displayMessage = "The old password you entered is incorrect.";
      }

      setErrorMessage(displayMessage);
      setSuccessMessage(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    changePasswordMutation.mutate({
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        {successMessage && (
          <p className="text-green-600 text-sm mt-2 text-center border p-2 rounded bg-green-50">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 text-center border p-2 rounded bg-red-50">
            {errorMessage}
          </p>
        )}

        <PasswordInput
          id="oldPassword"
          label="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          showPassword={showOldPassword}
          setShowPassword={setShowOldPassword}
        />
        <PasswordInput
          id="newPassword"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
        />
        <PasswordInput
          id="confirmNewPassword"
          label="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          showPassword={showConfirmNewPassword}
          setShowPassword={setShowConfirmNewPassword}
        />

        <Button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
