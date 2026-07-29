// Provider contract: { name, health(), generate(prompt, schema) }. Providers are
// enabled solely by environment variables, so adding an approved SDK later is isolated.
const configured = (name, key) => ({ name, health: () => Boolean(process.env[key]) });
export const providerChain = () => [configured('gemini', 'GEMINI_API_KEY'), configured('openai', 'OPENAI_API_KEY'), configured('claude', 'ANTHROPIC_API_KEY'), configured('kimi', 'KIMI_API_KEY')];
export const activeProviderName = () => providerChain().find((provider) => provider.health())?.name || 'unconfigured';
