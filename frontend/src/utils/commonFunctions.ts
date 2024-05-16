import { HistoryTransaction } from '@/types/historyTransaction'

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return formattedDate
}

export const formatDateNoHours = (dateString: string) => {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day} `
  return formattedDate
}

// Thif function is used format to currency usd without cents.
export const formatMoneyToUSD = (numberString: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
  const formattedNumber = formatter.format(numberString)
  return formattedNumber
}

export function sortTransactionsByDate(
  transactions: HistoryTransaction[],
): HistoryTransaction[] {
  // Sort transactions by date ascending.
  return transactions.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })
}

export function formatDateToYYYYMMDD(date: Date | null) {
  if (date) {
    const year = date.getFullYear()

    const month = String(date.getMonth() + 1).padStart(2, '0')

    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
}
export function convertISOToVNDateTimeString(isoDate: any) {
  const date = new Date(isoDate)
  const vietnamTime = new Date(
    date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
  )
  const year = vietnamTime.getFullYear()
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0')
  const day = String(vietnamTime.getDate()).padStart(2, '0')
  const hours = String(vietnamTime.getHours()).padStart(2, '0')
  const minutes = String(vietnamTime.getMinutes()).padStart(2, '0')
  const seconds = String(vietnamTime.getSeconds()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

export function getSevenDaysBeforeToday() {
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  return lastWeek
}

export function formatRoutePath(routeName:string){
  const lowerCaseString = routeName.toLowerCase();
  const formattedStr = lowerCaseString.replace(" ", "-");
  return formattedStr
}


export function getAllDatesFromLastAndThisWeek() {
  const today = new Date();
    const day = today.getDay(); // 0-6

    const diffMonday = today.getDate() - day - 6; // subtract 6 days to get to the previous Monday
    const diffSunday = today.getDate() + (7 - day); // add the remaining days to get to this Sunday

    const lastWeekMonday = new Date(today);
    lastWeekMonday.setDate(diffMonday);

    const thisWeekSunday = new Date(today);
    thisWeekSunday.setDate(diffSunday);

    return [lastWeekMonday, thisWeekSunday];
}

export function getLastTwoWeeksIncludingToday() {
    const result = [];
    for(let i=0; i<14; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        result.push(d);
    }
    return [result[result.length -1], result[0]];
}

export function getDaysOfWeekWithTodayLast() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const reorderedDays = daysOfWeek.slice(today + 1).concat(daysOfWeek.slice(0, today + 1));
    return reorderedDays;
}





