
export enum AgeRange {
  A20_25 = '20-25 év',
  A25_30 = '25-30 év',
  A30_35 = '30-35 év',
  A35_40 = '35-40 év',
  A40_PLUS = '40+ év'
}

export enum MaritalStatus {
  SINGLE = 'Egyedülálló',
  MARRIED = 'Házas/Kapcsolatban',
  OTHER = 'Egyéb'
}

export enum Motivation {
  MONEY = 'Pénz / Anyagi függetlenség',
  FREEDOM = 'Szabadság / Idő',
  PRODUCT = 'Termék / Egészség',
  COMMUNITY = 'Közösség / Elismerés'
}

export enum TimeFrame {
  T0_5 = 'Heti 0-5 óra',
  T5_10 = 'Heti 5-10 óra',
  T10_PLUS = 'Heti 10+ óra'
}

export interface CandidateData {
  age: AgeRange;
  hasChildren: boolean;
  maritalStatus: MaritalStatus;
  occupation: string;
  residence: string;
  traits: string[];
  motivation: Motivation;
  timeAvailability: TimeFrame;
  salesExperience: boolean;
  discType: string;
  notes: string;
}

export interface OpeningMessage {
  type: 'product' | 'business';
  text: string;
  title: string;
  psychology: string; // Miért működik ez a szöveg?
}

export interface ObjectionHandling {
  objection: string;
  rebuttal: string;
}

export interface AnalysisResult {
  profileSummary: string;
  motivations: string[];
  approachTips: string[];
  openingMessages: OpeningMessage[];
  objections: ObjectionHandling[];
  discAnalysis: {
    d: number; // 0-100
    i: number;
    s: number;
    c: number;
  };
}
