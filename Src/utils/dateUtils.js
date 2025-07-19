export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getToday = () => {
  return formatDate(new Date());
};

export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  return days;
};

export const getWeekDays = () => {
  const today = new Date();
  const week = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - today.getDay() + i);
    week.push(day);
  }
  
  return week;
};