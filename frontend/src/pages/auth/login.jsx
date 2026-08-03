import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import { Mail, Lock, LogIn } from "lucide-react";
import { InputField } from "../../Components/common/InputFeild";
import { message } from "antd";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email address.").required("Email is required."),
  password: yup.string().min(6, "Password must be at least 6 characters long.").required("Password is required."),
});

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.login(data.email, data.password);

      if (result.success) {
        if (result.user) {
          setUser(result.user);
          if (result.user.role === "ROLE_INSTRUCTOR") {
            navigate("/instructor");
          } else if (result.user.role === "ROLE_ADMIN") {
            navigate("/admin");
          } else {
            navigate("/courses");
          }
        } else {
          navigate("/courses");
        }
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div style={{ maxWidth: '450px', width: '100%' }}>
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle shadow mb-3" style={{ width: '60px', height: '60px' }}>
              <LogIn size={32} />
            </div>
            <h2 className="fw-bold mb-2">Welcome Back!</h2>
            <p className="text-muted">Sign in to your account to continue</p>
          </div>

          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <InputField
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  icon={<Mail size={18} />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <InputField
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  icon={<Lock size={18} />}
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="d-flex justify-content-end mb-4">
                  <Link
                    to="/forgot-password"
                    className="text-decoration-none small text-primary fw-semibold hover-underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2 px-3 small rounded-3">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-3 fw-bold rounded-3 shadow-sm mb-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="position-relative text-center mb-4">
                <hr className="text-muted" />
                <span className="bg-white px-3 position-absolute top-50 start-50 translate-middle small text-muted">
                  New to our platform?
                </span>
              </div>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary fw-bold text-decoration-none hover-underline"
                  >
                    Create account here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <p className="small text-muted">
              By signing in, you agree to our{" "}
              <a href="#" className="text-primary text-decoration-none hover-underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary text-decoration-none hover-underline">Privacy Policy</a>
            </p>
          </div>
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

export default Login;