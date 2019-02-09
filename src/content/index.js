import { injectIntoPage } from './contentInjection';

/**
 * currently only amazon cloud reader will be excluded from
 * injection
 */
if (window.location.href.match('read\\.amazon\\.com') != null) {
} else {
  injectIntoPage();
}
