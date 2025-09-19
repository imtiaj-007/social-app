import { cn } from './utils'

describe('cn utility function', () => {
    it('should merge class names correctly', () => {
        const result = cn('text-red-500', 'bg-blue-200')
        expect(result).toBe('text-red-500 bg-blue-200')
    })

    it('should handle conditional classes', () => {
        const isActive = true
        const result = cn('base-class', isActive && 'active-class', !isActive && 'inactive-class')
        expect(result).toBe('base-class active-class')
    })

    it('should deduplicate tailwind classes', () => {
        const result = cn('text-red-500', 'text-blue-500')
        expect(result).toBe('text-blue-500')
    })

    it('should handle empty inputs', () => {
        const result = cn()
        expect(result).toBe('')
    })

    it('should handle arrays of class names', () => {
        const result = cn(['class-a', 'class-b'], 'class-c')
        expect(result).toBe('class-a class-b class-c')
    })

    it('should handle objects with boolean values', () => {
        const result = cn({ 'class-a': true, 'class-b': false }, 'class-c')
        expect(result).toBe('class-a class-c')
    })
})
