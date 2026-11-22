// 'tsc --noEmit' type-checks ENTIRE project (uses tsconfig.json)
export default {
    '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
    '*.{ts,tsx}': ['eslint --fix', 'prettier --write', () => 'tsc --noEmit'],
    '*.{json,css,scss,md,yml,yaml,html}': ['prettier --write'],
};
