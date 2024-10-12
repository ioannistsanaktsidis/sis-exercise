import React from "react";
import { Spin } from "antd";

type LoadingProps = {
  loading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ loading }) => {
  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "20px auto" }}
        data-testid="loading-spinner"
      />
    );
  }
  return null;
};
