import { NextResponse } from 'next/server';

// Internal Admin Data Endpoint
// This endpoint is not linked from any page in the application.
// It simulates an internal admin service that provides configuration data.
// Players can discover this through SSRF.
export async function GET() {
  return NextResponse.json({
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
  });
}
