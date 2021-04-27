import { newSpecPage } from '@stencil/core/testing';
import { SvgColorer } from '../svg-colorer';

describe('svg-colorer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SvgColorer],
      html: `<svg-colorer></svg-colorer>`,
    });
    expect(page.root).toEqualHtml(`
      <svg-colorer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </svg-colorer>
    `);
  });
});
