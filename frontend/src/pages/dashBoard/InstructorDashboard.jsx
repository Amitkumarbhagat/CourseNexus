import { useState } from "react";
import InstructorCourses from "./InstructorCourses";
import Dashboard from "./Dashboard";
import InstructorSideBar from "./InstructorSideBar";
import DPayments from "./DPayments";
import { authService } from "../../api/auth.service";

function InstructorDashboard() {
  const [current, setCurrent] = useState("dashboard");
  const [isAuthenticated] = useState(authService.isInstructorAuthenticated());

  const renderContent = () => {
    switch (current) {
      case "dashboard":
        return <Dashboard isAuthenticated={isAuthenticated} role="instructor" />;
      case "courses":
        return <InstructorCourses />;
      case "payments":
        return <DPayments instructorId={authService.getCurrentUser().id} />;
      default:
        return <Dashboard isAuthenticated={isAuthenticated} role="instructor" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <h2 className="fs-3 fw-bold text-danger">Access Denied: Instructor Only</h2>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <InstructorSideBar current={current} onSelect={setCurrent} />
      <section className="flex-grow-1 bg-white m-3 rounded-4 shadow-sm overflow-auto" style={{ maxHeight: 'calc(100vh - 30px)' }}>
        <main className="p-4 p-md-5">{renderContent()}</main>
      </section>
    </div>
  );
}

export default InstructorDashboard;
