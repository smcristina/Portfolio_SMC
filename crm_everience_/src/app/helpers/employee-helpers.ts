export function getEmployeeAge(birthDate: string): number {
  const today = new Date();
  const bDate = new Date(birthDate);
  let age = today.getFullYear() - bDate.getFullYear();
  const m = today.getMonth() - bDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
    age--;
  }
  return age;
}

export function getEmployeeInitials(
  firstName: string,
  lastName: string
): { firstInitial: string; lastInitial: string } {
  return {
    firstInitial: firstName.slice(0, 1),
    lastInitial: lastName.slice(0, 1),
  };
}
