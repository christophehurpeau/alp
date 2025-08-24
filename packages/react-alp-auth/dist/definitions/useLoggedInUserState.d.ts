export interface LoggedInUserState {
    isLoggedIn: boolean;
    loggedInUserId: string | undefined;
    expiresIn: number | undefined;
}
export declare function useLoggedInUserState(serverCookieValue?: string | null): LoggedInUserState;
//# sourceMappingURL=useLoggedInUserState.d.ts.map