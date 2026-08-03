import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import { Mail, Lock, User, Calendar, Phone, KeyRound } from "lucide-react";
import { InputField } from "../../Components/common/InputFeild";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { message } from "antd";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email address.").required("Email is required."),
  username: yup.string().required("Username is required."),
  dob: yup.string().required("Date of birth is required."),
  mobileNumber: yup.string().matches(/^\d{10}$/, "Mobile number must be exactly 10 digits.").required("Mobile number is required."),
  newPassword: yup.string().min(6, "Password must be at least 6 characters long.").required("New password is required."),
});

function ForgotPassword() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.resetPasswordWithDetails(
        data.email,
        data.username,
        data.dob,
        data.mobileNumber,
        data.newPassword
      );

      if (result.success) {
        message.success(result.message || "Password reset successfully!");
        navigate("/login");
      } else {
        setError(result.error || "Reset failed. Please check your details.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />
      <Container className="flex-grow-1 py-5 d-flex align-items-center justify-content-center">
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle shadow mb-3" style={{ width: '60px', height: '60px' }}>
              <KeyRound size={32} />
            </div>
            <h2 className="fw-bold mb-2">Reset Password</h2>
            <p className="text-muted">Verify your personal details to reset</p>
          </div>

          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
                <InputField
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your registered email"
                  icon={<Mail size={18} />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <InputField
                  id="username"
                  type="text"
                  label="Username"
                  placeholder="Enter your exact username"
                  icon={<User size={18} />}
                  error={errors.username?.message}
                  {...register("username")}
                />

                <InputField
                  id="dob"
                  type="date"
                  label="Date of Birth"
                  icon={<Calendar size={18} />}
                  error={errors.dob?.message}
                  {...register("dob")}
                />

                <InputField
                  id="mobileNumber"
                  type="text"
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  icon={<Phone size={18} />}
                  error={errors.mobileNumber?.message}
                  {...register("mobileNumber")}
                />

                <InputField
                  id="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Enter a new password"
                  icon={<Lock size={18} />}
                  error={errors.newPassword?.message}
                  {...register("newPassword")}
                />

                {error && (
                  <Alert variant="danger" className="py-3 px-4 mt-2 rounded-3">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-3 mt-3 fw-bold rounded-3 shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Verifying...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>

              <div className="position-relative text-center mt-5 mb-4">
                <hr className="text-muted" />
                <span className="bg-white px-3 position-absolute top-50 start-50 translate-middle small text-muted">
                  Remember your password?
                </span>
              </div>

              <div className="text-center">
                <p className="text-muted mb-0">
                  <Link
                    to="/login"
                    className="text-primary fw-bold text-decoration-none hover-underline fs-5"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
      <style>{`
        .hover-underline:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;
