import type { Configuration } from 'lint-staged'

const config: Configuration = {
    '*.{js,jsx,ts,tsx,html,json,yml,yaml,md,mdx}': ['npm run format:fix'],
    '*.{html,json,yml,yaml,md,mdx}': ['npm run format:check'],
}

export default config
