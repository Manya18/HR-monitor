export const parseDateTime = (date_str: string) => {
  const date = new Date(date_str);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};
