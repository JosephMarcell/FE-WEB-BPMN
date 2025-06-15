export interface InputGeneralLedgerProperty {
  start_date: Date | null;
  end_date: Date | null;
}

export const inputGeneralLedgerInitialState: InputGeneralLedgerProperty = {
  start_date: null,
  end_date: null,
};
