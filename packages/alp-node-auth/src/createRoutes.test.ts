import assert from "node:assert/strict";
import { test } from "node:test";
// eslint-disable-next-line import-x/no-unresolved
import { createRouterBuilder } from "router-segments";
// eslint-disable-next-line import-x/extensions
import type { AuthController } from "./createAuthController.ts";
// eslint-disable-next-line import-x/extensions
import { createRoutes } from "./createRoutes.ts";

const createControllerMock = (): AuthController => ({
  login: () => undefined,
  addScope: () => undefined,
  response: () => undefined,
  logout: () => undefined,
});

type AuthRouteRef = (segment: any) => void;

const buildRouter = (routes: ReturnType<typeof createRoutes>) => {
  const builder = createRouterBuilder<never, unknown>();
  for (const [path, refOrSegment] of Object.values(routes)) {
    if (refOrSegment.length === 1) {
      builder.addSegment(path, refOrSegment as AuthRouteRef);
    } else {
      builder.add(path, refOrSegment);
    }
  }
  return builder.createRouter();
};

test("returns the expected route keys", () => {
  const routes = createRoutes(createControllerMock());
  assert.deepEqual(Object.keys(routes), ["login", "addScope", "logout"]);
});

test("maps each route to its path", () => {
  const routes = createRoutes(createControllerMock());
  assert.equal(routes.login[0], "/login{/:strategy}");
  assert.equal(routes.addScope[0], "/add-scope/:strategy/:scopeKey");
  assert.equal(routes.logout[0], "/logout");
});

test("wires addScope and logout to the controller refs", () => {
  const controller = createControllerMock();
  const routes = createRoutes(controller);
  assert.equal(routes.addScope[1], controller.addScope);
  assert.equal(routes.logout[1], controller.logout);
});

test("login route builds into a router with an optional strategy param", () => {
  const controller = createControllerMock();
  const router = buildRouter(createRoutes(controller));

  assert.equal(router.toPath("login"), "/login");

  const withoutStrategy = router.find("/login");
  assert.ok(withoutStrategy, "expected /login to match");
  assert.equal(withoutStrategy.ref, controller.login);

  const withStrategy = router.find("/login/google");
  assert.ok(withStrategy, "expected /login/google to match");
  assert.equal(withStrategy.ref, controller.login);
  assert.equal(withStrategy.namedParams?.get("strategy"), "google");
});

test("login segment registers the response sub-route", () => {
  const controller = createControllerMock();
  const router = buildRouter(createRoutes(controller));

  const response = router.find("/login/google/response");
  assert.ok(response, "expected /login/google/response to match");
  assert.equal(response.ref, controller.response);
  assert.equal(response.namedParams?.get("strategy"), "google");
});

test("addScope route resolves both named params", () => {
  const controller = createControllerMock();
  const router = buildRouter(createRoutes(controller));

  const match = router.find("/add-scope/google/calendar");
  assert.ok(match, "expected /add-scope/google/calendar to match");
  assert.equal(match.ref, controller.addScope);
  assert.equal(match.namedParams?.get("strategy"), "google");
  assert.equal(match.namedParams?.get("scopeKey"), "calendar");
});

test("logout route resolves to the controller ref", () => {
  const controller = createControllerMock();
  const router = buildRouter(createRoutes(controller));

  const match = router.find("/logout");
  assert.ok(match, "expected /logout to match");
  assert.equal(match.ref, controller.logout);
});
