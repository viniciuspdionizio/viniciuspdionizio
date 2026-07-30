const fs = require('fs');
const { execSync } = require('child_process');
const packageJson = require('../package.json');

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const buildDate = new Date().toISOString();

const content = `// Arquivo gerado automaticamente no build. Não editar manualmente.
export const versionInfo = {
  version: '${packageJson.version}',
  commitHash: '${commitHash}',
  buildDate: '${buildDate}',
};
`;

fs.writeFileSync('./src/app/version-info.ts', content);
console.log(`Version file generated: v${packageJson.version} (${commitHash})`);