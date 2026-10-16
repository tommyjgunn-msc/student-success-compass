import type { MetadataRoute } from 'next';

// A tool for ALCHE students, reached by link or QR code. Search engines stay out.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
