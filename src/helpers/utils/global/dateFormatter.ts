export class PeriodDateFormatter {
  static formatDate(inputDate: Date) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getMonthIndex(monthString: string) {
    monthString = monthString.toLowerCase();

    if (monthString === 'oktober') {
      monthString = 'october';
    }

    const monthMappings: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
      januari: 0,
      februari: 1,
      maret: 2,
      mei: 4,
      juni: 5,
      juli: 6,
      agustus: 7,
      oktober: 9,
      nopember: 10,
      desember: 11,
    };

    return monthMappings[monthString] ?? -1;
  }

  static getFormattedMonthDates(monthString: string, year: number) {
    const month = this.getMonthIndex(monthString);
    if (month < 0 || month > 11) {
      throw new Error('Invalid month. Please provide a valid month (0-11).');
    }
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const aDayBeforeStartDate = this.formatDate(new Date(year, month, 0));
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    return [formattedStartDate, formattedEndDate, aDayBeforeStartDate];
  }

  static subtractOneDayFromDate(inputDate: Date) {
    const date = new Date(inputDate);
    date.setDate(date.getDate() - 1);
    return this.formatDate(date);
  }

  static toFirstDateOfMonth(inputDate: Date) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  }
}
