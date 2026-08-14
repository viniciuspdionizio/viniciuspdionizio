import { routes } from './app.routes';

describe('app.routes', () => {
  it('should lazy-load HomeComponent as the default export for the root path', async () => {
    const rootRoute = routes.find((route) => route.path === '');
    expect(rootRoute).toBeTruthy();
    expect(rootRoute?.loadComponent).toBeTruthy();

    const loaded = await (rootRoute!.loadComponent as () => Promise<{ default: unknown }>)();
    expect(loaded.default).toBeTruthy();
  });

  it('should redirect any unknown path back to the root', () => {
    const wildcard = routes.find((route) => route.path === '**');
    expect(wildcard?.redirectTo).toBe('');
  });
});
