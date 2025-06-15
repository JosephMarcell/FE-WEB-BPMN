export type ViolationStatus =
  | 'REPORTED'
  | 'UNDER_REVIEW'
  | 'RESOLVED'
  | 'DISMISSED';

export const ViolationStatusFiter = [
  { value: 'REPORTED', label: 'REPORTED' },
  { value: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
  { value: 'RESOLVED', label: 'RESOLVED' },
  { value: 'DISMISSED', label: 'DISMISSED' },
];
export type ViolationType =
  | 'ILLEGAL_FISHING'
  | 'POLLUTION'
  | 'HABITAT_DESTRUCTION'
  | 'ASSET_MISSING'
  | 'OTHER';

export const violationTypes: { [key in ViolationType]: string } = {
  ILLEGAL_FISHING: 'Illegal Fishing',
  POLLUTION: 'Pollution',
  HABITAT_DESTRUCTION: 'Habitat Destruction',
  ASSET_MISSING: 'Asset Missing',
  OTHER: 'Others',
};

export type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export const severityTypes: { [key in ViolationSeverity]: string } = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};
export const ViolationSeverityFiter = [
  { value: 'LOW', label: 'LOW' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'HIGH', label: 'HIGH' },
];

export type getAllViolationsProps = {
  pkid: number;
  report_title: string;
  latitude: number;
  longitude: number;
  status: ViolationStatus;
  severity: ViolationSeverity;
  violation_type: ViolationType;
  description: string;
};

export type getViolationDeatilProps = {
  report_title: string;
  pkid: number;
  reported_by_pkid: number;
  latitude: number;
  longitude: number;
  violation_type: ViolationType;
  status: ViolationStatus;
  severity: ViolationSeverity;
  description: string;
  office_pkid: number;
  reported_at: string;
};

export type getMediaProps = {
  media_url: string;
  media_type: string;
  pkid: number;
};

export type createViolationProps = {
  report_title: string;
  reported_by_pkid: number;
  latitude: number;
  longitude: number;
  reported_at: string;
  violation_type: ViolationType;
  status: ViolationStatus;
  severity: ViolationSeverity;
  description: string;
  office_pkid: number;
};

export type updateViolationProps = {
  report_title: string;
  pkid: number;
  latitude: number;
  longitude: number;
  reported_at: string;
  reported_by_pkid: number;
  violation_type: ViolationType;
  status: ViolationStatus;
  severity: ViolationSeverity;
  description: string;
};
export interface ListViolationProps {
  data: getAllViolationsProps[];
  maxPage: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  error: Error | null;
}

export const getStatusClass = (status: ViolationStatus) => {
  switch (status) {
    case 'REPORTED':
      return 'text-yellow-600 bg-yellow-100';
    case 'UNDER_REVIEW':
      return 'text-blue-600 bg-blue-100';
    case 'RESOLVED':
      return 'text-green-600 bg-green-100';
    case 'DISMISSED':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
export const getSeverityClass = (severity: ViolationSeverity) => {
  switch (severity) {
    case 'LOW':
      return 'text-blue-600 bg-blue-100';
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-100';
    case 'HIGH':
      return 'text-red-600 bg-red-100';
  }
};
