/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SocialLink {
  id: 'whatsapp' | 'facebook' | 'x' | 'telegram' | 'instagram';
  name: string;
  url: string;
  handle: string;
  color: string;
}

/**
 * Centralized social media URLs for SUBPLUG.
 * Can easily be configured or replaced with official organization endpoints.
 */
export const SUBPLUG_SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://wa.me/2348101234567?text=Hello%20Subplug,%20I%20need%20assistance%20with%20VTU%20services',
    handle: '+234 810 123 4567',
    color: '#25D366',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://facebook.com/subplugng',
    handle: '@subplugng',
    color: '#1877F2',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    url: 'https://x.com/subplug_ng',
    handle: '@subplug_ng',
    color: '#FFFFFF',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    url: 'https://t.me/subplug_ng',
    handle: '@subplug_ng',
    color: '#0088CC',
  },
];
