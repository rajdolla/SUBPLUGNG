/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PartnerItem } from '../types/cms';

// SVG 1: MTN Nigeria
const mtnSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <rect width="200" height="80" rx="16" fill="#FFCC00"/>
  <ellipse cx="100" cy="40" rx="72" ry="28" stroke="#000000" stroke-width="4.5" fill="none"/>
  <text x="100" y="49" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" text-anchor="middle" fill="#000000" letter-spacing="1">MTN</text>
</svg>`;

// SVG 2: Globacom (Glo)
const gloSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <circle cx="100" cy="40" r="34" fill="#00843D"/>
  <circle cx="100" cy="40" r="30" fill="#009944"/>
  <text x="100" y="49" font-family="'Trebuchet MS', Arial, sans-serif" font-weight="bold" font-size="28" text-anchor="middle" fill="#FFFFFF" letter-spacing="-1">glo</text>
</svg>`;

// SVG 3: T2mobile (Telecommunications Network)
const t2mobileSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <g transform="translate(18, 14)">
    <circle cx="28" cy="26" r="22" fill="#0284C7"/>
    <path d="M20 18H36M28 18V34" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="44" cy="14" r="5" fill="#10B981"/>
    <text x="58" y="34" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="24" fill="#0F172A" letter-spacing="-0.5">T2<tspan fill="#0284C7">mobile</tspan></text>
  </g>
</svg>`;

// SVG 4: Airtel Nigeria
const airtelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <g transform="translate(24, 16)">
    <path d="M22 10C13 10 6 17 6 26C6 35 13 42 22 42C27 42 32 39 34 35L27 31C26 33 24 35 22 35C17 35 14 31 14 26C14 21 17 17 22 17C26 17 29 20 30 23L37 20C35 14 30 10 22 10Z" fill="#ED1C24"/>
    <path d="M22 4C18 4 15 7 15 11H21C21 10 21.5 9.5 22 9.5C22.5 9.5 23 10 23 11V16H29V11C29 7 26 4 22 4Z" fill="#ED1C24"/>
    <text x="44" y="35" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="27" fill="#ED1C24" letter-spacing="-0.5">airtel</text>
  </g>
</svg>`;

// SVG 5: Smile Communications (4G LTE)
const smileSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <g transform="translate(10, 16)">
    <text x="18" y="34" font-family="'Trebuchet MS', Arial, sans-serif" font-weight="900" font-size="28" fill="#E4007D">Sm</text>
    <rect x="62" y="16" width="5.5" height="18" rx="2" fill="#E4007D"/>
    <circle cx="64.7" cy="9" r="3.5" fill="#8DC63F"/>
    <text x="73" y="34" font-family="'Trebuchet MS', Arial, sans-serif" font-weight="900" font-size="28" fill="#E4007D">le</text>
    <rect x="114" y="17" width="52" height="18" rx="4" fill="#8DC63F"/>
    <text x="140" y="30" font-family="Arial, sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#FFFFFF">4G LTE</text>
  </g>
</svg>`;

// SVG 6: Spectranet 4G LTE
const spectranetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="none">
  <g transform="translate(12, 10)">
    <path d="M18 32C18 20 28 10 41 10C48 10 54 13 58 18L51 23C49 20 45 18 41 18C33 18 27 24 27 32C27 40 33 46 41 46C46 46 50 43 52 39L59 43C55 50 48 54 41 54C28 54 18 44 18 32Z" fill="#0B5C9C"/>
    <path d="M34 14C42 6 54 6 62 14" stroke="#E31B23" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M28 8C40 -4 56 -4 68 8" stroke="#E31B23" stroke-width="3.5" stroke-linecap="round"/>
    <text x="68" y="37" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="#0B5C9C" letter-spacing="-0.3">spectranet</text>
    <text x="69" y="49" font-family="Arial, sans-serif" font-weight="800" font-size="8.5" fill="#E31B23" letter-spacing="2">4G LTE</text>
  </g>
</svg>`;

const toDataUrl = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const INITIAL_PARTNERS: PartnerItem[] = [
  {
    id: 'partner-mtn',
    name: 'MTN Nigeria',
    logoUrl: toDataUrl(mtnSvg),
    altText: 'MTN Nigeria Official Network Partner',
    websiteUrl: 'https://www.mtn.ng',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'partner-glo',
    name: 'Globacom (Glo)',
    logoUrl: toDataUrl(gloSvg),
    altText: 'Globacom Telecommunications Official Partner',
    websiteUrl: 'https://www.gloworld.com/ng',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'partner-t2mobile',
    name: 'T2mobile',
    logoUrl: toDataUrl(t2mobileSvg),
    altText: 'T2mobile Telecommunications Official Partner',
    websiteUrl: 'https://t2mobile.ng',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'partner-airtel',
    name: 'Airtel Nigeria',
    logoUrl: toDataUrl(airtelSvg),
    altText: 'Airtel Nigeria Official Telecoms Partner',
    websiteUrl: 'https://www.airtel.com.ng',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'partner-smile',
    name: 'Smile Communications',
    logoUrl: toDataUrl(smileSvg),
    altText: 'Smile 4G LTE Broadband Partner',
    websiteUrl: 'https://smile.com.ng',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'partner-spectranet',
    name: 'Spectranet 4G LTE',
    logoUrl: toDataUrl(spectranetSvg),
    altText: 'Spectranet 4G LTE Broadband Partner',
    websiteUrl: 'https://spectranet.com.ng',
    displayOrder: 6,
    isActive: true,
  },
];
