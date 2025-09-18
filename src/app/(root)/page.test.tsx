import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
    it('renders the home page heading', () => {
        render(<Home />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent('Home Page')
    })
})
