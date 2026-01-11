// Types matching backend API contract

export interface DiagramLocation {
  sheet: number;
  region: string;
}

export interface Check {
  id: string;
  name: string;
  status: "pass" | "warning" | "fail" | "not_applicable";
  standard: string;
  message: string;
  description?: string;
  location?: DiagramLocation;
}

export interface ComplianceSummary {
  total_codes_evaluated: number;
  passing_count: number;
  warning_count: number;
  failing_count: number;
  not_applicable_count: number;
  compliance_score: number;
}

// Backend API response from /analyze or /analyze-file
export interface AnalysisResponse {
  analysis_id: string;
  status: "completed" | "error";
  created_at: string;
  nec_version: string;
  system_type: string;
  diagram_description: string;
  findings: Check[];
  summary: ComplianceSummary;
}

// Frontend document type (combines analysis with file metadata)
export interface Document {
  id: string;
  filename: string;
  uploadedAt: string;
  fileSize: string;
  status: "analyzing" | "complete" | "error";
  fileUrl?: string;
  // Analysis data from backend
  nec_version?: string;
  system_type?: string;
  diagram_description?: string;
  summary: {
    passed: number;
    warnings: number;
    failed: number;
    not_applicable?: number;
    compliance_score?: number;
  };
  checks: Check[];
}

export type CheckStatus = "pass" | "warning" | "fail" | "not_applicable";

// Helper to convert AnalysisResponse to Document
export function analysisToDocument(
  analysis: AnalysisResponse,
  filename: string,
  fileSize: string,
  fileUrl?: string
): Document {
  return {
    id: analysis.analysis_id,
    filename,
    uploadedAt: analysis.created_at.split("T")[0],
    fileSize,
    status: analysis.status === "completed" ? "complete" : "error",
    fileUrl,
    nec_version: analysis.nec_version,
    system_type: analysis.system_type,
    diagram_description: analysis.diagram_description,
    summary: {
      passed: analysis.summary.passing_count,
      warnings: analysis.summary.warning_count,
      failed: analysis.summary.failing_count,
      not_applicable: analysis.summary.not_applicable_count,
      compliance_score: analysis.summary.compliance_score,
    },
    checks: analysis.findings,
  };
}
