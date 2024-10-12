import React from "react";
import { Alert } from "antd";

type ErrorAlertProps = {
  error: string | null;
};

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (error) {
    return (
      <Alert
        message={error}
        type="error"
        showIcon
        style={{ marginTop: "20px" }}
      />
    );
  }

  return null;
};
