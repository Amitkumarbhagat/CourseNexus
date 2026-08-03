import img1 from "../../assets/images/user.png";
import { Nav, Button } from "react-bootstrap";

function SideBar({ current, onSelect }) {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "bx bxs-dashboard" },
    { key: "user", label: "Users", icon: "bx bxs-group" },
    { key: "courses", label: "Courses", icon: "bx bxs-book" },
    { key: "payments", label: "Payments", icon: "bx bx-money" },
  ];

  const handleLogout = () => {
    import("../../api/auth.service").then(({ authService }) => {
      authService.logout();
      window.location.reload();
    });
  };

  return (
    <div className="bg-white shadow-sm d-flex flex-column border-end" style={{ width: '280px', minHeight: '100vh' }}>
      <div
        className="d-flex align-items-center gap-3 p-4 border-bottom"
        onClick={() => onSelect("dashboard")}
        style={{ cursor: 'pointer' }}
      >
        <img src={img1} alt="Admin Logo" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
        <span className="fs-5 fw-bold text-primary">CourseNexus Admin</span>
      </div>
      
      <Nav className="flex-column flex-grow-1 p-3 gap-2 mt-2">
        {menuItems.map((item) => (
          <Nav.Item key={item.key}>
            <Nav.Link
              onClick={() => onSelect(item.key)}
              className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition ${
                current === item.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark hover-bg-light"
              }`}
            >
              <i className={`${item.icon} fs-5`} />
              <span className="fw-semibold">{item.label}</span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      
      <div className="p-3 border-top mt-auto">
        <Button
          variant="light"
          onClick={handleLogout}
          className="w-full d-flex align-items-center gap-3 px-3 py-2 text-danger hover-bg-danger-light border-0 fw-semibold w-100 text-start transition"
        >
          <i className="bx bx-log-out fs-5" />
          <span>Logout</span>
        </Button>
      </div>
      <style>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
        .hover-bg-danger-light:hover {
          background-color: #f8d7da;
        }
        .transition {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default SideBar;
