/*
 * Configuração segura do Astra Pro.
 *
 * Mantenha `enabled: false` até que:
 * 1. os três produtos estejam ativos na Play Console;
 * 2. o endpoint HTTPS valide o recibo diretamente com o Google Play;
 * 3. compras, restauração, cancelamento e expiração tenham sido testados.
 *
 * Não coloque chaves privadas nem credenciais do Google neste arquivo.
 */
window.ASTRA_BILLING = Object.freeze({
  enabled: false,
  validatorUrl: '',
  productIds: Object.freeze([
    'astra_pro_mensal',
    'astra_pro_trimestral',
    'astra_pro_anual'
  ])
});
