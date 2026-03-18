import DialogBase from "./DialogBase";
import { WarningIcon } from "../../icons";
import "../../App.css";

export default function DeleteConfirmDialog({ isOpen, onClose, task, onConfirm }) {
  const handleDelete = () => {
    onConfirm(task.id);
    onClose();
  };

  return (
    <DialogBase isOpen={isOpen} onClose={onClose} maxWidth="420px">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}><WarningIcon size={48} /></div>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "900",
          color: "#dc2626",
          marginBottom: "12px",
          marginTop: 0
        }}>
          Delete Task?
        </h2>
        <p style={{ marginTop: 8, color: "#4B6B4B", fontSize: 15, lineHeight: 1.5 }}>
          Are you sure you want to delete <strong style={{ color: "#3B6E3B" }}>"{task?.name}"</strong>?
          <br />
          This action cannot be undone.
        </p>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={onClose}
            className="btn ghost"
            style={{ flex: 1 }}
            autoFocus
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="btn primary"
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              border: "none"
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </DialogBase>
  );
}
