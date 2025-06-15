export interface EndOfMonthProperty {
  month: string | null;
  year: number | null;
}

export const endOfMonthInitialState: EndOfMonthProperty = {
  month: null,
  year: null,
};
