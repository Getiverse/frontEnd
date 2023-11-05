export function loadI18n(language = 'en') {
  switch (language) {
    case 'sv':
      import('dayjs/locale/sv')
      break

    default:
      import('dayjs/locale/en')
  }
}
