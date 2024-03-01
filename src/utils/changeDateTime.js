import { format, parseISO } from 'date-fns';

export const changeDateTime = (dateString) => {
    const parsedDate = parseISO(dateString);
    const formattedDate = format(parsedDate, 'dd-MM-yyyy \u00A0 hh:mm a');
    return formattedDate;
}

export const changeDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    const formattedDate = format(parsedDate, 'dd-MM-yyyy');
    return formattedDate;
}

export const changeMonthFromat = (dateString) => {
    const parsedDate = parseISO(dateString);
    const formattedDate = format(parsedDate, 'MMM yyyy');
    return formattedDate;
}

export const formatTime = (timeString) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], options);
};
