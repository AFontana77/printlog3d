/**
 * IndexNow key for printlog3d.com.
 *
 * IndexNow is the one search-engine submission channel this property can use
 * without an authenticated account, and it is the channel that matters here:
 * printlog3d's historical traffic is Bing-weighted, and Bing consumes
 * IndexNow directly.
 *
 * The key is proved by hosting it at /<key>.txt, which public/ does. Losing
 * that file silently disables submission, so it is checked by acceptance.
 */
export const INDEXNOW_KEY = '136813a5832b60d12821217b386d2008';
