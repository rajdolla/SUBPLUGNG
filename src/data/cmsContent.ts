/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LandingPageCMS } from '../types/cms';
import { DEFAULT_CMS_DATA } from './defaultCmsData';

/**
 * Centrally configurable Landing Page CMS content foundation.
 * This structure decouples copy and settings from presentation components,
 * preparing the entire landing page to be populated dynamically by the Supabase Admin CMS.
 */
export const DEFAULT_LANDING_PAGE_CMS: LandingPageCMS = DEFAULT_CMS_DATA;
