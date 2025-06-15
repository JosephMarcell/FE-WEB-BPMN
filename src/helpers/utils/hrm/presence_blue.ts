export interface PresenceBlueProperty {
  pkid: number | null;
  employee_id: number | null;
  presence: string | null;
  check_in: string | null;
  check_out: string | null;
  actual_check_in: string | null;
  actual_check_out: string | null;
  event_description: string | null;
}

export const presenceBlueInitialState: PresenceBlueProperty = {
  pkid: null,
  employee_id: null,
  presence: null,
  check_in: null,
  check_out: null,
  actual_check_in: null,
  actual_check_out: null,
  event_description: null,
};

export interface CountHourPresenceBlueOutputProperty {
  bukpotOutput: {
    penalty_hour: number;
    work_hour: number;
    allPresence: PresenceBlueProperty[];
  };
}
