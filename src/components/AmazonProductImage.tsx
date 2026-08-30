import manifest from '@/data/amazon-images.json';

/**
 * Renders an Amazon product image from the link manifest.
 *
 * Ported from the pattern proven on digitalpictureframes. Three compliance rules
 * shape it, and all three are enforced here rather than left to operational
 * discipline:
 *
 *  1. No image bytes are ever stored or served from our origin. The manifest
 *     holds URLs only, and this renders them with a plain <img>.
 *  2. `next/image` is deliberately NOT used for Amazon URLs — it downloads,
 *     transforms and caches the source bytes, which the Associates Operating
 *     Agreement forbids. `next/image` stays correct for our own brand assets.
 *  3. The agreement permits storing a link for 24 hours. If the manifest is
 *     older than that, this renders the brand emblem instead of an expired link,
 *     so a missed refresh degrades safely rather than going out of compliance.
 *
 * The site is statically prerendered, so a fresh manifest changes nothing until
 * a rebuild. `tools/webmon/refresh_image_manifests.py --push` regenerates and
 * pushes, which is what triggers that rebuild. printlog3d is registered in its
 * TAGS map.
 *
 * Width and height come from the API so the browser reserves the right box and
 * the image cannot cause layout shift.
 */

type ManifestImage = { url: string; width?: number | null; height?: number | null };
type ManifestItem = { title?: string; primary: ManifestImage; variants?: ManifestImage[] };
type Manifest = { fetched_at: string; ttl_hours: number; items: Record<string, ManifestItem> };

const data = manifest as unknown as Manifest;

function isFresh(): boolean {
  const fetched = Date.parse(data.fetched_at);
  if (Number.isNaN(fetched)) return false;
  const ttlMs = (data.ttl_hours ?? 24) * 60 * 60 * 1000;
  return Date.now() - fetched < ttlMs;
}

export function getProductImage(asin?: string | null): ManifestItem | null {
  if (!asin || !isFresh()) return null;
  return data.items[asin] ?? null;
}

export function AmazonProductImage({
  asin,
  productName,
  className = '',
}: {
  asin?: string | null;
  /** Used only as context for assistive tech. The image itself is decorative. */
  productName: string;
  className?: string;
}) {
  const item = getProductImage(asin);

  if (!item?.primary?.url) {
    // Brand emblem rather than a broken image or an empty well.
    return (
      <span
        className={`flex items-center justify-center ${className}`}
        style={{ background: 'var(--surface-1)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/emblem.webp"
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          className="h-10 w-10 opacity-40"
        />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.primary.url}
      alt={productName}
      width={item.primary.width ?? undefined}
      height={item.primary.height ?? undefined}
      loading="lazy"
      className={className}
    />
  );
}
