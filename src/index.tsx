import { hydrate } from 'preact-iso';
import { App } from './app';
import './index.css';

if (typeof window !== 'undefined') {
  hydrate(<App />);
}