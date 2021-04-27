import { newE2EPage } from '@stencil/core/testing';

describe('svg-colorer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<svg-colorer></svg-colorer>');

    const element = await page.find('svg-colorer');
    expect(element).toHaveClass('hydrated');
  });
});
