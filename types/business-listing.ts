export type BusinessListingType = 'introduction' | 'business' | 'other';
export type BusinessListingCategory = 'licensed_corp' | 'cpa' | 'law_firm' | 'compliance' | 'other';
export type BusinessListingStatus = 'pending' | 'approved' | 'rejected';

export interface BusinessListing {
  id: string;
  type: string[]; // Changed to array
  category: string[]; // Changed to array
  name: string;
  description?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  image_url?: string;
  views: number;
  is_pinned: boolean;
  status: BusinessListingStatus;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessListingDTO {
  type: string[];
  category: string[];
  name: string;
  description?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  image_url?: string;
}
