import { apiClient } from "./api";
import { ChatAIResponse, ChatMessage } from "@/types/chatbot";

interface BackendChatMessage {
  id: number;
  patient_id: number;
  role: "user" | "assistant" | "system";
  message: string;
  created_at: string;
}

export const chatApi = {
  /**
   * Send user message to Ayu AI (Grok-powered FastAPI endpoint)
   */
  sendMessage: async (message: string, patientId?: string | number): Promise<ChatAIResponse> => {
    const sessionPid = patientId || localStorage.getItem("arogyam_session");
    const headers: Record<string, string> = {};
    if (sessionPid) {
      headers["X-Patient-Id"] = String(sessionPid);
    }

    const payload: { message: string; patient_id?: number } = { message };
    if (sessionPid && !isNaN(Number(sessionPid))) {
      payload.patient_id = Number(sessionPid);
    }

    return await apiClient<ChatAIResponse>("/api/chat", {
      data: payload,
      headers,
    });
  },

  /**
   * Fetch recent chat dialogue from PostgreSQL for current patient
   */
  getChatHistory: async (patientId?: string | number): Promise<ChatMessage[]> => {
    const sessionPid = patientId || localStorage.getItem("arogyam_session");
    const headers: Record<string, string> = {};
    if (sessionPid) {
      headers["X-Patient-Id"] = String(sessionPid);
    }

    try {
      const endpoint = sessionPid && !isNaN(Number(sessionPid))
        ? `/api/chat/history/${sessionPid}`
        : "/api/chat/history";

      const raw = await apiClient<BackendChatMessage[]>(endpoint, { headers });
      if (!Array.isArray(raw)) return [];

      return raw.map((m) => ({
        id: String(m.id),
        role: m.role,
        content: m.message,
        timestamp: m.created_at,
      }));
    } catch (err) {
      console.warn("Could not fetch remote chat history:", err);
      return [];
    }
  },
};
