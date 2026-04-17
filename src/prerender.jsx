import { renderToString } from 'preact-render-to-string';
import { h } from 'preact';
import { App } from './app.jsx';

export function prerender() {
  return renderToString(h(App));
}
