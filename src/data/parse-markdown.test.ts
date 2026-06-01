import test from 'node:test';
import assert from 'node:assert';
import { extractH2UlSections } from './parse-markdown.ts';

test('extractH2UlSections', async (t) => {
  await t.test('extracts a single h2 and ul section', () => {
    const html = `
      <h2>Features</h2>
      <ul>
        <li>Fast</li>
        <li>Reliable</li>
      </ul>
    `;
    const result = extractH2UlSections(html);
    assert.deepStrictEqual(result, [
      { title: 'Features', items: ['Fast', 'Reliable'] },
    ]);
  });

  await t.test('extracts multiple h2 and ul sections', () => {
    const html = `
      <h2>Pros</h2>
      <ul><li>Good</li></ul>
      <h2>Cons</h2>
      <ul><li>Bad</li></ul>
    `;
    const result = extractH2UlSections(html);
    assert.deepStrictEqual(result, [
      { title: 'Pros', items: ['Good'] },
      { title: 'Cons', items: ['Bad'] },
    ]);
  });

  await t.test('handles whitespace between h2 and ul', () => {
    const html = `
      <h2>Whitespace Test</h2>



      <ul>
        <li>Item 1</li>
      </ul>
    `;
    const result = extractH2UlSections(html);
    assert.deepStrictEqual(result, [
      { title: 'Whitespace Test', items: ['Item 1'] },
    ]);
  });

  await t.test('returns empty array when no match is found', () => {
    const html = `
      <h3>Not an H2</h3>
      <ul><li>Item</li></ul>
      <h2>No UL following</h2>
      <ol><li>Item</li></ol>
    `;
    const result = extractH2UlSections(html);
    assert.deepStrictEqual(result, []);
  });

  await t.test('strips HTML tags from li content', () => {
    const html = `
      <h2>Formatted Items</h2>
      <ul>
        <li><strong>Bold</strong> text</li>
        <li><a href="#">Link</a></li>
        <li><span>Span</span></li>
      </ul>
    `;
    const result = extractH2UlSections(html);
    assert.deepStrictEqual(result, [
      { title: 'Formatted Items', items: ['Bold text', 'Link', 'Span'] },
    ]);
  });

  await t.test('trims whitespace from the h2 title', () => {
    const html = `<h2>  Spaced Title  </h2><ul><li>Item</li></ul>`;
    const result = extractH2UlSections(html);
    assert.deepStrictEqual(result, [
      { title: 'Spaced Title', items: ['Item'] },
    ]);
  });

  await t.test('does not match if h2 contains nested html', () => {
    const html = `<h2>Title with <span>span</span></h2><ul><li>Item</li></ul>`;
    const result = extractH2UlSections(html);
    assert.deepStrictEqual(result, []); // Regex is /<h2>([^<]+)<\/h2>/ so it fails
  });
});
