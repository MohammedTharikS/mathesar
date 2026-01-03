import { render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LogoAndNameWithLink from '../LogoAndNameWithLink.svelte';

// Mock the preloadCommonData function
const mockCommonData: { branding_logo_url: string | null } = {
    branding_logo_url: null,
};

vi.mock('@mathesar/utils/preloadData', () => ({
    preloadCommonData: () => mockCommonData,
}));

// We rely on real Logo and MathesarName components.
// MathesarName has aria-label="Mathesar"
// Logo handles its own rendering.

describe('LogoAndNameWithLink', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('shows Mathesar name when no custom logo is set', async () => {
        mockCommonData.branding_logo_url = null;

        // We import the component inside the test if needed to ensure fresh module, 
        // but vi.resetModules should handle it if we used dynamic import. 
        // However, since we import at top level, vi.resetModules might not re-evaluate the import of the component itself 
        // if it was already imported? 
        // Actually, Svelte components are compiled to classes. The instance is creating a new scope.
        // The `const commonData = preloadCommonData()` is inside <script>, so it runs on instance creation.
        // So modifying `mockCommonData` is sufficient.

        render(LogoAndNameWithLink, { props: { href: '/' } });

        // MathesarName has aria-label="Mathesar" (from staticText.MATHESAR)
        // We look for that.
        const nameEl = screen.queryByLabelText(/Mathesar/i);
        expect(nameEl).not.toBeNull();
    });

    it('hides Mathesar name when custom logo is set', async () => {
        mockCommonData.branding_logo_url = 'https://example.com/logo.png';
        // Clean up previous render
        document.body.innerHTML = '';

        render(LogoAndNameWithLink, { props: { href: '/' } });

        const nameEl = screen.queryByLabelText(/Mathesar/i);
        expect(nameEl).toBeNull();
    });
});
