// Gera src/app/shared/data/countries.ts a partir da metadata oficial da
// libphonenumber-js (ISO2 + DDI) combinada com Intl.DisplayNames (nomes em
// pt-BR, nativo do runtime — sem dependência extra). Evita digitar ~200
// países/DDIs à mão, o que seria fonte garantida de erro.
//
// Rodar: node scripts/generate-countries.js
// Rodar de novo sempre que a libphonenumber-js for atualizada para uma major
// que possa ter mudado a lista de países suportados.

const fs = require('fs');
const path = require('path');
const { getCountries, getCountryCallingCode } = require('libphonenumber-js/min');

const displayNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' });

// Bandeira via Unicode regional indicators: cada letra do ISO2 vira um
// "regional indicator symbol" (A-Z -> U+1F1E6..U+1F1FF); o par renderiza como
// emoji de bandeira nativamente, sem precisar de nenhum asset/ícone.
const REGIONAL_INDICATOR_BASE = 0x1f1e6;
function flagEmoji(iso2) {
  return [...iso2.toUpperCase()]
    .map((letter) => String.fromCodePoint(REGIONAL_INDICATOR_BASE + letter.charCodeAt(0) - 65))
    .join('');
}

const countries = getCountries()
  .map((iso2) => ({
    iso2,
    name: displayNames.of(iso2) ?? iso2,
    dialCode: getCountryCallingCode(iso2),
    flag: flagEmoji(iso2),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

// Nenhum nome de país em pt-BR contém aspas simples — se algum dia passar a
// conter, essa concatenação precisa virar um escape de verdade.
const lines = countries
  .map(({ iso2, name, dialCode, flag }) => `  { iso2: '${iso2}', name: '${name}', dialCode: '${dialCode}', flag: '${flag}' },`)
  .join('\n');

const content = `// Arquivo gerado por scripts/generate-countries.js — não editar manualmente.
// Para atualizar (ex: após upgrade de major da libphonenumber-js), rode:
//   node scripts/generate-countries.js
import type { CountryCode } from 'libphonenumber-js/min';

export interface Country {
  iso2: CountryCode;
  name: string;
  dialCode: string;
  /** Emoji de bandeira (par de regional indicators derivado do ISO2). */
  flag: string;
}

export const COUNTRIES: Country[] = [
${lines}
];
`;

const outPath = path.join(__dirname, '../src/app/shared/data/countries.ts');
fs.writeFileSync(outPath, content);
console.log(`Gerado ${outPath} com ${countries.length} países.`);
