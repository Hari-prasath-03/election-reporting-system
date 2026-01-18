export type User = {
  id: string;
  email: string;
  display_name: string;
  role: "admin" | "informer" | "user";
};

export type ConstituencyData = {
  id: number;
  s_no: number;
  constituency: string;
  district: string;
  type: "General" | "SC" | "ST";
  candidate_count?: number;
};

export type Party = {
  id: number;
  name: string;
  short_name: string;
  symbol_url: string;
  color_code: string;
};

export type PartyFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    short_name?: string[];
    symbol_url?: string[];
    symbol_img?: string[];
    color_code?: string[];
  };
};

export type LoginState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export type UserFormState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    display_name?: string[];
    role?: string[];
    id?: string[];
  };
};

export type Candidate = {
  id: number;
  name: string;
  party_id: number;
  constituency_id: number;
  photo_url: string;
  gender: string;
  total_votes_cache?: number;
  parties?: {
    name?: string;
    symbol_url?: string;
    short_name: string;
    color_code?: string;
  };
  constituencies?: {
    name: string;
  };
};

export type CandidateFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    party_id?: string[];
    constituency_id?: string[];
    photo_img?: string[];
    gender?: string[];
  };
};

export type CountingCenter = {
  id: number;
  name: string;
  location_address: string;
  constituencies?: {
    id: number;
    name: string;
  }[];
};

export type CountingCenterFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    location_address?: string[];
  };
};

export type ForgotPasswordState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
  };
};

export type ResetPasswordState = {
  success: boolean;
  message?: string;
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
};
