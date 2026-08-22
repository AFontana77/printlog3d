import { NextResponse } from 'next/server';

// apple-app-site-association — served at /.well-known/apple-app-site-association
// iOS Universal Links: lets the OS open baitcastcatch.com links directly in the app.
//
// ACTION REQUIRED before App Store submission:
//   Replace APPLE_TEAM_ID with your 10-character Apple Developer Team ID.
//   Find it at: developer.apple.com > Account > Membership > Team ID
//
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: 'APPLE_TEAM_ID.com.anvilroad.printlog3d',
          paths: ['*'],
        },
      ],
    },
  });
}
