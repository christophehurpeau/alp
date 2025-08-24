interface AuthStateValue {
  loggedInUserId: string;
  expiresIn: number;
}

export const parseCookie = (stateValue?: string): AuthStateValue | null => {
  return stateValue ? (JSON.parse(stateValue) as AuthStateValue) : null;
};
