// Internal Admin Service
// This service is ONLY accessible from localhost (port 3071)
// It simulates an internal admin panel that should not be exposed to external users

const PORT = 3071;

const server = Bun.serve({
  hostname: '127.0.0.1',
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/admin') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'ShopZone Internal Admin Service',
        version: '2.1.0',
        endpoints: {
          dashboard: '/admin-panel-x7k9m',
          dashboard_info: 'The admin dashboard is available at /admin-panel-x7k9m on the main application.',
          features: [
            'User management',
            'Product management',
            'System diagnostics (ping utility)',
            'File upload for product images',
          ],
          note: 'Access to the admin dashboard requires 2FA verification. The verification uses a cookie-based check (2fa_verified=true).',
          internal_config: {
            flag_location: '/root/flag.txt',
            admin_panel_path: '/admin-panel-x7k9m',
          },
        },
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/admin/status') {
      return new Response(JSON.stringify({
        status: 'running',
        uptime: process.uptime(),
        services: {
          database: 'connected',
          cache: 'connected',
          file_storage: 'available',
        },
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Internal Admin Service running on http://127.0.0.1:${PORT}`);
