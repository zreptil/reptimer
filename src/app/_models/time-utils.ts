export class TimeUtils {

  static timeFromDate(value: Date): number {
    return value.getHours() * 60 + value.getMinutes();
  }

  static timeForDisplay(value: number): string {
    if (value == null) {
      return '';
    }
    const h = Math.floor(value / 60);
    const m = value % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
  }
}
