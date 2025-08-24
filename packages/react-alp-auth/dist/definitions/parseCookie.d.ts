interface AuthStateValue {
    loggedInUserId: string;
    expiresIn: number;
}
export declare const parseCookie: (stateValue?: string) => AuthStateValue | null;
export {};
//# sourceMappingURL=parseCookie.d.ts.map