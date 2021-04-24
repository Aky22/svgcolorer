import { newSpecPage } from '@stencil/core/testing';
import { SvgRenderer } from './svg-renderer';

describe('svg-renderer', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SvgRenderer],
      html: '<svg-renderer></svg-renderert>',
    });
    expect(root).toEqualHtml(`
      <svg-renderer>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </svg-renderer>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SvgRenderer],
      html: `<svg-renderer first="Stencil" last="'Don't call me a framework' JS"></svg-renderer>`,
    });
    expect(root).toEqualHtml(`
      <svg-renderer first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </svg-renderer>
    `);
  });
});
