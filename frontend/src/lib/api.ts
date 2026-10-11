const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatPayload {
  message: string;
  language?: string;
  session_id?: string;
  history?: Array<{ role: string; content: string }>;
}

export interface SchemeProfile {
  age: number;
  state: string;
  income: number;
  occupation: string;
  gender: string;
  category: string;
}

export interface SchemeItem {
  id: string;
  name: string;
  name_hi?: string;
  category: string;
  ministry: string;
  description: string;
  benefits: string;
  documents_required: string[];
  application_steps: string[];
  official_portal: string;
  match_score?: number;
  match_reasons?: string[];
}

export interface GrievanceData {
  id: string;
  title: string;
  description: string;
  user_language: string;
  translated_title_en?: string;
  translated_description_en?: string;
  formal_letter?: string;
  category: string;
  urgency: string;
  department: string;
  status: string;
  citizen_name?: string;
  citizen_phone?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface IssueReportData {
  id: string;
  image_url: string;
  detected_issue: string;
  severity: string;
  category: string;
  safety_notes?: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  status: string;
  created_at: string;
}

export interface AdminStatsData {
  total_grievances: number;
  total_issue_reports: number;
  total_cases: number;
  resolution_rate_percent: number;
  by_category: Record<string, number>;
  by_status: Record<string, number>;
  by_city: Record<string, number>;
  by_urgency: Record<string, number>;
  hotspots: Array<{
    location: string;
    total_complaints: number;
    unresolved_cases: number;
    intensity: string;
  }>;
  recent_grievances: GrievanceData[];
  recent_issues: IssueReportData[];
}

export interface AdminSummaryData {
  executive_summary: string;
  emerging_trends: string[];
  critical_hotspots: string[];
  key_recommendations: string[];
  generated_at: string;
  ai_powered: boolean;
}

export const api = {
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  chat: async (payload: ChatPayload) => {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to chat with AI");
    return res.json();
  },

  getAllSchemes: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    const res = await fetch(`${API_BASE}/api/schemes?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch schemes");
    return res.json();
  },

  matchSchemes: async (profile: SchemeProfile) => {
    const res = await fetch(`${API_BASE}/api/schemes/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to match schemes");
    return res.json();
  },

  submitGrievance: async (payload: {
    description: string;
    user_language?: string;
    citizen_name?: string;
    citizen_phone?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const res = await fetch(`${API_BASE}/api/grievance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to file grievance");
    return res.json();
  },

  getGrievanceById: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/grievance/${encodeURIComponent(id)}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch grievance");
    }
    return res.json();
  },

  getAllGrievances: async (filters?: { status?: string; category?: string; city?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.city) params.append("city", filters.city);
    const res = await fetch(`${API_BASE}/api/grievances?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch grievances list");
    return res.json();
  },

  updateGrievanceStatus: async (id: string, status: string, notes?: string) => {
    const res = await fetch(`${API_BASE}/api/grievance/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, resolution_notes: notes }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },

  reportIssue: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/api/report-issue`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to report issue");
    return res.json();
  },

  getAllReports: async (filters?: { category?: string; status?: string; city?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.city) params.append("city", filters.city);
    const res = await fetch(`${API_BASE}/api/reports?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch infrastructure reports");
    return res.json();
  },

  getAdminStats: async (): Promise<AdminStatsData> => {
    const res = await fetch(`${API_BASE}/api/admin/stats`);
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
  },

  getAdminSummary: async (): Promise<AdminSummaryData> => {
    const res = await fetch(`${API_BASE}/api/admin/summary`);
    if (!res.ok) throw new Error("Failed to fetch admin summary");
    return res.json();
  },
};
