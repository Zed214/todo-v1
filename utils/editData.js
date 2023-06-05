export const EditStatItem = (items) => {
  const arrStats = ["active", "completed"];

  for (const item of items) {
    if (arrStats.includes(item.status) === false) {
      item.status = "undefine";
      item.deadline = dateStrFormat(new Date(item.deadline));
    }
  }
};

export const dateStrFormat = (date) => {
  const y = date.toLocaleString("en-US", { year: "numeric" });
  const m = date.toLocaleString("en-US", { month: "2-digit" });
  const d = date.toLocaleString("en-US", { day: "2-digit" });

  return `${y}-${m}-${d}`;
};
