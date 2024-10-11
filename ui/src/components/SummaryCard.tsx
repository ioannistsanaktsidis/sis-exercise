import React from "react";
import { Card } from "antd";

type SummaryCardProps = {
  summary: string;
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  if (summary) {
    return (
      <Card title="Summary" size="small" style={{ marginTop: "20px" }}>
        <p>{summary}</p>
      </Card>
    );
  }
  return null;
};
