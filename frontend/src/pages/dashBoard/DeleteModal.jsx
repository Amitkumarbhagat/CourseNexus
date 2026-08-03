import { Modal, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button, Spinner, Badge } from "react-bootstrap";

function DeleteModal({
  isOpen,
  onClose,
  onSuccess,
  onDelete,
  item = null,
  itemType = "item",
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item?",
  itemDisplayName = "",
  customContent = null,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) {
      message.error("Delete function not provided");
      return;
    }

    setLoading(true);
    try {
      const result = await onDelete(item);
      
      if (result && result.success === false) {
        message.error(result.error || `Failed to delete ${itemType}`);
      } else {
        message.success(`${itemType} deleted successfully!`);
        onClose();
        onSuccess?.(); // Callback to refresh data
      }
    } catch (error) {
      message.error(`Failed to delete ${itemType}`);
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (customContent) {
      return customContent;
    }

    return (
      <div className="d-flex align-items-start gap-3">
        <div className="flex-shrink-0">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} className="fs-4" />
          </div>
        </div>
        <div className="flex-grow-1">
          <h5 className="fw-bold text-dark mb-2">
            {title}
          </h5>
          <div className="text-muted d-flex flex-column gap-2">
            <p className="mb-0">
              {description}
              {itemDisplayName && (
                <span className="fw-bold text-dark ms-1">
                  <Badge bg="light" text="dark" className="border px-2 py-1">{itemDisplayName}</Badge>
                </span>
              )}
            </p>
            <p className="small text-danger fw-semibold mb-0">
              ⚠️ This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      className="delete-modal"
      centered
    >
      <div className="p-2">
        {renderContent()}
        
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <Button
            variant="light"
            onClick={onClose}
            className="px-4 border fw-medium"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 fw-medium d-flex align-items-center"
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteModal;