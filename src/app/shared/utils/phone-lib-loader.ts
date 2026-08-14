/**
 * Carrega a metadata de telefones (libphonenumber-js) sob demanda, via import()
 * dinâmico, para não inflar o bundle inicial (ContactComponent é importado
 * estaticamente pela única rota do app — ver angular.json budgets).
 *
 * A Promise é memoizada em nível de módulo para que a diretiva de máscara e o
 * validator de telefone, que podem disparar a carga quase ao mesmo tempo, não
 * acabem pedindo dois import() concorrentes.
 */
let modulePromise: Promise<typeof import('libphonenumber-js/min')> | null = null;

export function loadPhoneLib(): Promise<typeof import('libphonenumber-js/min')> {
  return modulePromise ??= import('libphonenumber-js/min');
}
