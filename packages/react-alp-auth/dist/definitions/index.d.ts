import type { GetServerSidePropsContext } from "alp-nextjs";
interface LoggedInUserState {
    isLoggedIn: boolean;
    loggedInUserId: string | undefined;
    expiresIn: number | undefined;
}
declare function useLoggedInUserStateServer(serverCookieValue?: string | null): LoggedInUserState;
export declare const useLoggedInUserState: typeof useLoggedInUserStateServer;
export declare const getServerAuthCookieValue: (ctx: GetServerSidePropsContext) => string | null;
export {};
//# sourceMappingURL=index.d.ts.map