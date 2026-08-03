import React from "react";
import { Form, InputGroup } from "react-bootstrap";

export const InputField = React.forwardRef(({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  icon,
  error,
  ...rest
}, ref) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={id} className="fw-bold text-primary">
        {label}
      </Form.Label>
      <InputGroup hasValidation>
        {icon && <InputGroup.Text className="bg-white border-end-0 text-muted">{icon}</InputGroup.Text>}
        <Form.Control
          ref={ref}
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          isInvalid={!!error}
          className={`py-2 shadow-sm ${icon ? "border-start-0 ps-0" : ""}`}
          {...rest}
        />
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
});
