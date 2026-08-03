import { useState } from "react";
import Courses from "./DCourses";
import Dashboard from "./Dashboard";
import SideBar from "./SideBar";
import Users from "./DUsers";
import DPayments from "./DPayments";
import { authService } from "../../api/auth.service";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

function AdminDashboard() {
  const [current, setCurrent] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAdminAuthenticated());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const renderContent = () => {
    switch (current) {
      case "dashboard":
        return <Dashboard isAuthenticated = {isAuthenticated} />;
      case "user":
        return <Users />;
      case "courses":
        return <Courses />;
      case "payments":
        return <DPayments />;
      default:
        return <Dashboard isAuthenticated = {isAuthenticated}/>;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await authService.login(username, password);

    if (result.success && result.user.role === "ROLE_ADMIN") {
      setIsAuthenticated(true);
      setError("");
    } else if (result.success && result.user.role !== "ROLE_ADMIN") {
      setError("You are not authorized as admin.");
    } else {
      setError(result.error || "Invalid username or password");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <SideBar current={current} onSelect={setCurrent} />
      <section className="flex-grow-1 transition bg-white m-3 rounded-4 shadow-sm overflow-auto" style={{ maxHeight: 'calc(100vh - 30px)' }}>
        <main className="p-4 p-md-5">{renderContent()}</main>
      </section>

      {!isAuthenticated && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75" style={{ zIndex: 1050, backdropFilter: 'blur(10px)' }}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '400px', width: '100%' }}>
            <Card.Body className="p-5">
              <h3 className="fw-bold text-center text-dark mb-4">
                Admin Login
              </h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-muted small">Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    className="py-2"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-muted small">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="py-2"
                  />
                </Form.Group>
                {error && (
                  <Alert variant="danger" className="py-2 small fw-medium">
                    {error}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 fw-bold"
                >
                  Sign In
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      )}
      <style>{`
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
