# Changelog

## [0.3.0](https://github.com/viniciuspdionizio/viniciuspdionizio/compare/viniciuspdionizio-v0.2.2...viniciuspdionizio-v0.3.0) (2026-08-18)


### Features

* add @netlify/angular-runtime dependency to support Netlify functions ([a5dfd6e](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/a5dfd6e7f316ce47839372c950e2617162192c98))
* add character count validation to message textarea in contact form ([ec520f4](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/ec520f461f64dc7c2bcd716c9c0fc8ddc085daae))
* add environment variable check for RESEND_API_KEY in send-email function ([bb81390](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/bb8139019bd1ce53394492fddf946c20fc9c14f0))
* add GitHub Actions workflow for building and deploying GitHub Pages ([22ef6c8](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/22ef6c8f18acbab224d1a75125102785f72eb6b0))
* add Netlify configuration and functions for email handling ([340c92c](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/340c92cafa2b227c9c765d0be4cd525e0c73b592))
* add ngx-sonner for toast notifications and update footer component with social links ([7bf7818](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/7bf78181e73af5de7fcc5782e9131c89365a4d3e))
* **contact:** add international phone mask with country selector ([36d6a9e](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/36d6a9e4047b235b07d54dffc57a1fd0d6747c63))
* **contact:** validate phone format on the frontend ([0b7999e](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/0b7999eb0211babeb999cc3aad5e8df1d0cbf7d0))
* enhance footer component to display version information and update layout ([e95c175](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/e95c1751a498f6a5d50a8c99d792d5a5e0754510))
* generate version info file and update footer component to display version ([929f54d](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/929f54d2ca290dd9373ea119062775692d1f8df9))
* **i18n:** internationalize the whole site (pt-BR/en-US) ([45ab78a](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/45ab78a0f561e7c8fc2303acbec87fe85d2267ef))
* implement email sending functionality using Resend service ([e78af33](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/e78af33c8913b782673238c4f71e211cd540b201))
* integrate Tailwind CSS and PostCSS for styling ([0e2625b](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/0e2625bd779c018fc5ef54410ebe25c71d6fbbba))
* **release:** add release-please automation ([#2](https://github.com/viniciuspdionizio/viniciuspdionizio/issues/2)) ([f02037b](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/f02037b9ea37b632df85693fe8a2c19df50cdf98))
* **security:** harden contact form against spam and abuse ([9faed09](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/9faed0934489980752b6b0ea9b8b8c159b69e8e2))
* **seo:** add robots.txt, sitemap.xml and canonical link ([c50d843](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/c50d84369870f8ca2dbe7934615bbcbfa3dcdd6f))
* update email addresses and improve email sending logic in contact form ([08a8acd](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/08a8acdff4b95ae5c0b18c7016597debaef72b94))


### Bug Fixes

* add missing commas for consistency in send-email function response ([f488df7](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/f488df77d30b7181efeb3256e24b920e73af3294))
* adjust scrollIntoView block position to 'center' for better alignment ([78012a5](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/78012a5767f6a834e34c9ef2e01fcd10262df0ad))
* allow GitHub Pages origin in CORS and fix invalid CSS syntax ([db7af94](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/db7af94e016c64eefe94885a0250df6fd1b73502))
* **ci:** generate version-info.ts before running tests ([5c0b3f3](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/5c0b3f3425881980279874a1cd2c611a3346a1f3))
* **deploy:** set outputMode:server so Angular injects the App Engine manifest ([3d7323b](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/3d7323b0809132b5d1cf29c2ea37078fdab48356))
* harden send-email function and remove stray root file ([0132f88](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/0132f88c260fa8a33aa84521ca4ebc21ab16380a))
* **header:** sync isScrolled state on init to fix refresh glitch ([723f7a1](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/723f7a1344554e9228538e2c7c9bab4d8746eb7e))
* **i18n:** register pt-BR locale for date/number pipes ([2e11352](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/2e1135223d12a682317dea90c6ff6f1bd3c75c61))
* improve error logging for Resend service in send-email function ([9ae8987](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/9ae8987147a7723195aa8636ec4d15b84199308a))
* **phone:** mark the selected &lt;option&gt; via attribute for correct SSR default ([0f6d7b6](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/0f6d7b695517b048fd6317b49c62db982c409736))
* **release:** pin release-please target-branch to main ([#6](https://github.com/viniciuspdionizio/viniciuspdionizio/issues/6)) ([1717bcc](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/1717bcc6292e7b4bdf0a4a33b20cb12f46a3a57a))
* update email address in contact section ([b3488d5](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/b3488d5c436b3408f022a59d63ced13be5af2b72))
* update environment configuration for development and production ([eca8450](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/eca8450db24198594efd00cde4b2ddb64a7047aa))


### Performance Improvements

* preconnect to Google Fonts and use font-display swap ([735eb6a](https://github.com/viniciuspdionizio/viniciuspdionizio/commit/735eb6a4334084e6bfc5b0ea7742e11e2fb177c7))
