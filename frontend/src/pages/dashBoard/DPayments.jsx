import React, { useState, useEffect } from "react";
import { paymentService } from "../../api/payment.service";
import { message } from "antd";
import { Card, Table, Spinner, Badge } from "react-bootstrap";

function DPayments({ instructorId = null }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = instructorId
          ? await paymentService.getInstructorPayments(instructorId)
          : await paymentService.getAllPayments();

        if (res.success) {
          setPayments(res.data);
        } else {
          message.error("Failed to load payments");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
      <Card.Body className="p-4 p-md-5">
        <h3 className="fw-bold text-dark mb-4">Payments</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No payments found.
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 text-muted fw-semibold small text-uppercase">Payment ID</th>
                  <th className="py-3 text-muted fw-semibold small text-uppercase">Course</th>
                  <th className="py-3 text-muted fw-semibold small text-uppercase">User</th>
                  <th className="py-3 text-muted fw-semibold small text-uppercase">Amount</th>
                  <th className="py-3 text-muted fw-semibold small text-uppercase">Date</th>
                  <th className="py-3 text-muted fw-semibold small text-uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-3 text-muted small">
                      {payment.razorpayPaymentId ? payment.razorpayPaymentId : payment.id.substring(0, 8) + '...'}
                    </td>
                    <td className="py-3 fw-medium text-dark">{payment.course?.course_name || 'N/A'}</td>
                    <td className="py-3 text-muted small">{payment.user?.email || 'N/A'}</td>
                    <td className="py-3 fw-bold text-dark">₹{payment.amount}</td>
                    <td className="py-3 text-muted small">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill fw-medium">
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default DPayments;
