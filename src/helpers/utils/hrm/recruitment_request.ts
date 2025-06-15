export interface RecruitmentRequestProperty {
  pkid: number;
  position_id: number | null;
  description: string | null;
  needed_number: number | null;
  status: string | null;
  Position?: {
    pkid: number | null;
    name: string | null;
    description: string | null;
  };
}

export const recruitmentRequestInitialState: RecruitmentRequestProperty = {
  pkid: 0,
  position_id: 0,
  description: null,
  needed_number: 0,
  status: null,
  Position: {
    pkid: 0,
    name: null,
    description: null,
  },
};
