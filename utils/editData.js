export const EditStatItem = (items) => {
  const arrStats = ["active", "completed"];

  for (const item of items) {
    if (arrStats.includes(item.status) === false) {
      item.status = "undefine";
    }
  }
};
