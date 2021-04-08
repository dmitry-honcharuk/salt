import { format, isToday } from 'date-fns';

export function getDisplayTime(unix: number): string {
  if (isToday(unix)) {
    return format(unix, `'Today at' HH:mm`);
  }

  return format(unix, `do 'of' LLLL',' yyyy`);
}
