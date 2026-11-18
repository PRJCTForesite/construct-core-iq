import { describe, expect, it } from 'vitest';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { sitemapStaticPaths, sitemapXML } from './sitemap';

describe('public sitemap', () => {
  it('includes public pages but excludes all private descendants', () => {
    const root = createRootRoute({ staticData: { sitemap: false } });
    const home = createRoute({ getParentRoute: () => root, path: '/', staticData: { sitemap: true } });
    const pricing = createRoute({ getParentRoute: () => root, path: '/pricing', staticData: { sitemap: true } });
    const app = createRoute({ getParentRoute: () => root, path: '/app', staticData: { sitemap: 'exclude-subtree' } });
    const project = createRoute({ getParentRoute: () => app, path: '/projects', staticData: { sitemap: true } });
    const router = createRouter({ routeTree: root.addChildren([home, pricing, app.addChildren([project])]) });
    expect(sitemapStaticPaths(router)).toEqual(['/', '/pricing']);
  });
  it('uses the published Foresite origin without invented timestamps', () => {
    const xml = sitemapXML('https://foresiteos.com.au', [{ path: '/' }, { path: '/pricing' }]);
    expect(xml).toContain('<loc>https://foresiteos.com.au/</loc>');
    expect(xml).toContain('<loc>https://foresiteos.com.au/pricing</loc>');
    expect(xml).not.toContain('<lastmod>');
  });
});