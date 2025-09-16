import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.ts',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            reporter: ['json', 'html'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: [
                '.next',
                'coverage',
                'build',
                'dist',
                'node_modules',
                'src/**/types/**',
                'src/**/interfaces/**',
                'src/**/*.d.ts',
                'src/setupTests.ts',
                'src/**/*.{test,spec}.{ts,tsx}',
            ],
            thresholds: {
                statements: 0,
                branches: 0,
                functions: 0,
                lines: 0,
            },
        },
    },
})
