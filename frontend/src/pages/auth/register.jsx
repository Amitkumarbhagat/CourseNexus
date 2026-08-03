import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import { authService } from "../../api/auth.service";
import { User, Mail, Phone, Lock, Calendar, MapPin, Briefcase, Github, Linkedin, UserPlus } from "lucide-react";
import { InputField } from "../../Components/common/InputFeild";
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from "react-bootstrap";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const registerSchema = yup.object().shape({
  username: yup.string().required("Full name is required."),
  email: yup.string().email("Please enter a valid email address.").required("Email is required."),
  mobileNumber: yup.string().matches(/^\d{10}$/, "Mobile number must be exactly 10 digits.").required("Phone number is required."),
  password: yup.string().min(6, "Password must be at least 6 characters long.").required("Password is required."),
  dob: yup.string(),
  gender: yup.string(),
  role: yup.string().required("Role is required."),
  location: yup.string(),
  profession: yup.string(),
  linkedin_url: yup.string().url("Must be a valid URL").nullable().transform(v => v === "" ? null : v),
  github_url: yup.string().url("Must be a valid URL").nullable().transform(v => v === "" ? null : v),
});

function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      role: "USER"
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await authService.register(data);

      if (result.success) {
        navigate("/login", {
          state: { message: "Registration successful! Please sign in to continue." }
        });
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />
      <Container className="flex-grow-1 py-5 d-flex align-items-center justify-content-center">
        <div style={{ maxWidth: '900px', width: '100%' }}>
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle shadow mb-3" style={{ width: '60px', height: '60px' }}>
              <UserPlus size={32} />
            </div>
            <h2 className="fw-bold mb-2">Create Your Account</h2>
            <p className="text-muted">Join our community and start your journey</p>
          </div>

          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <div className="mb-5">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-4">
                    Basic Information
                  </h4>
                  <Row className="g-4">
                    <Col md={6}>
                      <InputField
                        id="username"
                        icon={<User size={18} />}
                        label="Full Name"
                        placeholder="Enter your full name"
                        error={errors.username?.message}
                        {...register("username")}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        id="email"
                        type="email"
                        icon={<Mail size={18} />}
                        label="Email Address"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        {...register("email")}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        id="mobileNumber"
                        type="tel"
                        icon={<Phone size={18} />}
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        error={errors.mobileNumber?.message}
                        {...register("mobileNumber")}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        id="password"
                        type="password"
                        icon={<Lock size={18} />}
                        label="Password"
                        placeholder="Create a strong password"
                        error={errors.password?.message}
                        {...register("password")}
                      />
                    </Col>
                  </Row>
                </div>

                {/* Personal Details */}
                <div className="mb-5">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-4">
                    Personal Details
                  </h4>
                  <Row className="g-4">
                    <Col md={4}>
                      <InputField
                        id="dob"
                        type="date"
                        icon={<Calendar size={18} />}
                        label="Date of Birth"
                        error={errors.dob?.message}
                        {...register("dob")}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="gender" className="fw-bold text-primary">Gender</Form.Label>
                        <Form.Select id="gender" {...register("gender")} className="py-2 shadow-sm">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="role" className="fw-bold text-primary">Register As</Form.Label>
                        <Form.Select id="role" {...register("role")} className="py-2 shadow-sm">
                          <option value="USER">Student</option>
                          <option value="INSTRUCTOR">Instructor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Professional Details */}
                <div className="mb-5">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-4">
                    Professional Details
                  </h4>
                  <Row className="g-4">
                    <Col md={6}>
                      <InputField
                        id="location"
                        icon={<MapPin size={18} />}
                        label="Location"
                        placeholder="Enter your location"
                        error={errors.location?.message}
                        {...register("location")}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        id="profession"
                        icon={<Briefcase size={18} />}
                        label="Profession"
                        placeholder="Enter your profession"
                        error={errors.profession?.message}
                        {...register("profession")}
                      />
                    </Col>
                  </Row>
                </div>

                {/* Social Links */}
                <div className="mb-5">
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-4">
                    Social Links
                  </h4>
                  <Row className="g-4">
                    <Col md={6}>
                      <InputField
                        id="linkedin_url"
                        icon={<Linkedin size={18} />}
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/your-profile"
                        error={errors.linkedin_url?.message}
                        {...register("linkedin_url")}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        id="github_url"
                        icon={<Github size={18} />}
                        label="GitHub"
                        placeholder="https://github.com/your-username"
                        error={errors.github_url?.message}
                        {...register("github_url")}
                      />
                    </Col>
                  </Row>
                </div>

                {error && (
                  <Alert variant="danger" className="py-3 px-4 mb-4 rounded-3">
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              
              <div className="position-relative text-center mb-4">
                <hr className="text-muted" />
                <span className="bg-white px-3 position-absolute top-50 start-50 translate-middle small text-muted">
                  Already have an account?
                </span>
              </div>

              <div className="text-center">
                <p className="text-muted mb-0">
                  <Link
                    to="/login"
                    className="text-primary fw-bold text-decoration-none hover-underline fs-5"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <p className="small text-muted">
              By creating an account, you agree to our{" "}
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

export default RegistrationForm;