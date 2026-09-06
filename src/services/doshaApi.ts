import { apiClient } from "./api";
import { DoshaResult, DoshaType } from "@/types/dosha";

interface BackendDoshaResult {
  id?: number;
  patient_id?: number;
  assessment_id?: number;
  vata_percentage: number;
  pitta_percentage: number;
  kapha_percentage: number;
  primary_dosha: string;
  secondary_dosha?: string;
  constitution: string;
  assessment_date?: string;
  created_at?: string;
}

export const doshaApi = {
  /**
   * Submit questionnaire answers and calculate calibrated Dosha result
   */
  submitAssessment: async (
    patientId: number | string | null,
    answers: Record<string, string>
  ): Promise<DoshaResult> => {
    const raw = await apiClient<BackendDoshaResult>("/api/dosha/assessment", {
      data: {
        patient_id: patientId ? Number(patientId) : undefined,
        answers,
      },
    });

    return {
      vata: Math.round(raw.vata_percentage),
      pitta: Math.round(raw.pitta_percentage),
      kapha: Math.round(raw.kapha_percentage),
      primaryDosha: raw.primary_dosha as DoshaType,
      secondaryDosha: raw.secondary_dosha ? (raw.secondary_dosha as DoshaType) : undefined,
      constitution: raw.constitution,
      assessmentDate: raw.assessment_date || raw.created_at || new Date().toISOString(),
    };
  },

  /**
   * Fetch latest saved Dosha result for a patient
   */
  getLatestResult: async (patientId: number | string): Promise<DoshaResult | null> => {
    try {
      const raw = await apiClient<BackendDoshaResult>(`/api/dosha/result/${patientId}`);
      return {
        vata: Math.round(raw.vata_percentage),
        pitta: Math.round(raw.pitta_percentage),
        kapha: Math.round(raw.kapha_percentage),
        primaryDosha: raw.primary_dosha as DoshaType,
        secondaryDosha: raw.secondary_dosha ? (raw.secondary_dosha as DoshaType) : undefined,
        constitution: raw.constitution,
        assessmentDate: raw.assessment_date || raw.created_at || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  /**
   * Fetch assessment history for a patient
   */
  getHistory: async (patientId: number | string): Promise<DoshaResult[]> => {
    try {
      const raw = await apiClient<BackendDoshaResult[]>(`/api/dosha/history/${patientId}`);
      return raw.map((item) => ({
        vata: Math.round(item.vata_percentage),
        pitta: Math.round(item.pitta_percentage),
        kapha: Math.round(item.kapha_percentage),
        primaryDosha: item.primary_dosha as DoshaType,
        secondaryDosha: item.secondary_dosha ? (item.secondary_dosha as DoshaType) : undefined,
        constitution: item.constitution,
        assessmentDate: item.created_at || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  },
};
