export interface InputIncomeStatementProperty {
  start_date: Date | null;
  end_date: Date | null;
}

export const inputIncomeStatementInitialState: InputIncomeStatementProperty = {
  start_date: null,
  end_date: null,
};
