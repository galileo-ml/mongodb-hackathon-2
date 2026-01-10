export interface Document {
  id: string;
  filename: string;
  uploadedAt: string;
  fileSize: string;
  status: "analyzing" | "complete";
  fileUrl?: string;
  summary: {
    passed: number;
    warnings: number;
    failed: number;
  };
  checks: Check[];
}

export interface Check {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail";
  standard: string;
  message: string;
  description?: string;
  location?: {
    sheet: number;
    region: string;
  };
}

export type CheckStatus = "pass" | "warning" | "fail";
