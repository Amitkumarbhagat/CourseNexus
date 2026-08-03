import { useState } from "react";
import { LayoutDashboard, BookOpen, LogOut, Menu, X, CreditCard } from "lucide-react";
import { Nav, Button, Offcanvas } from "react-bootstrap";

function InstructorSideBar({ current, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "courses", icon: <BookOpen size={20} />, label: "My Courses" },
    { id: "payments", icon: <CreditCard size={20} />, label: "Payments" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-4 border-bottom bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
            <span className="fw-bold fs-5">I</span>
          </div>
          <h4 className="fw-bold text-primary mb-0">Instructor</h4>
        </div>
      </div>

      <Nav className="flex-column flex-grow-1 p-3 gap-2 overflow-auto">
        {menuItems.map((item) => (
          <Nav.Item key={item.id}>
            <Nav.Link
              onClick={() => {
                onSelect(item.id);
                setIsOpen(false);
              }}
              className={`d-flex align-items-center gap-3 px-4 py-3 rounded-3 transition fw-semibold ${
                current === item.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover-bg-light"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <div className="p-4 border-top bg-light">
        <Button
          variant="light"
          className="w-100 d-flex align-items-center gap-3 px-4 py-3 text-danger hover-bg-danger-light border-0 fw-bold transition"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <LogOut size={20} />
          <span>Return to Home</span>
        </Button>
      </div>
      <style>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa;
          color: #0d6efd !important;
        }
        .hover-bg-danger-light:hover {
          background-color: #f8d7da;
        }
        .transition {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="primary"
        className="d-md-none position-fixed rounded-circle shadow"
        style={{ top: '1rem', left: '1rem', zIndex: 1050, width: '45px', height: '45px' }}
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Desktop Sidebar */}
      <div className="d-none d-md-flex flex-column bg-white border-end shadow-sm" style={{ width: '280px', minHeight: '100vh', position: 'sticky', top: 0 }}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Offcanvas) */}
      <Offcanvas show={isOpen} onHide={toggleSidebar} placement="start" className="d-md-none" style={{ width: '280px' }}>
        <Offcanvas.Header closeButton className="border-bottom bg-primary bg-opacity-10">
          <Offcanvas.Title className="fw-bold text-primary">Instructor</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column">
          <Nav className="flex-column flex-grow-1 p-3 gap-2 overflow-auto">
            {menuItems.map((item) => (
              <Nav.Item key={item.id}>
                <Nav.Link
                  onClick={() => {
                    onSelect(item.id);
                    setIsOpen(false);
                  }}
                  className={`d-flex align-items-center gap-3 px-4 py-3 rounded-3 transition fw-semibold ${
                    current === item.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-secondary hover-bg-light"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <div className="p-4 border-top bg-light">
            <Button
              variant="light"
              className="w-100 d-flex align-items-center gap-3 px-4 py-3 text-danger hover-bg-danger-light border-0 fw-bold transition"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <LogOut size={20} />
              <span>Return to Home</span>
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default InstructorSideBar;
