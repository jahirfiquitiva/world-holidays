module.exports = {
  locales: ['en', 'es'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'not-found', 'countries'],
    '/': ['home', 'holidays'],
  },
  logger: ({ i18nKey, namespace }) => {
    // Country names intentionally fall back to a default when untranslated,
    // so silence the missing-key warnings for the "countries" namespace only.
    if (namespace === 'countries') return;
    const prefix =
      typeof window === 'undefined'
        ? '[next-translate-server]'
        : '[next-translate]';
    console.warn(
      `${prefix} "${namespace}:${i18nKey}" is missing in current namespace configuration. Try adding "${i18nKey}" to the namespace "${namespace}".`,
    );
  },
};
