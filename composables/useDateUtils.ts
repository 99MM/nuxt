export function useDateUtils() {

    const weekDays = ['日', '一', '二', '三', '四', '五', '六']

    const isSameDate = (a: Date, b: Date): boolean => {
        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        )
    }

    const getWeekNumber = (date: Date): number => {
        const firstDay = new Date(date.getFullYear(), 0, 1)
        const dayOfYear = Math.floor((date.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24))
        return Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7)
    }

    const getFirstDayOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getMonthMatrix = (date: Date): Date[][] => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const totalDays = getDaysInMonth(year, month)
        const startDay = firstDay.getDay() // 0~6

        const weeks: Date[][] = []
        let current = new Date(year, month, 1 - startDay)

        for (let i = 0; i < 6; i++) {
            const week: Date[] = []
            for (let j = 0; j < 7; j++) {
                week.push(new Date(current))
                current.setDate(current.getDate() + 1)
            }
            weeks.push(week)
        }

        return weeks
    }

    return {
        weekDays,
        isSameDate,
        getWeekNumber,
        getFirstDayOfMonth,
        getDaysInMonth,
        getMonthMatrix
    }
}
