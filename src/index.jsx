import { hydrate, h } from 'preact';
import { App } from './app.jsx';
import './index.css';

hydrate(h(App), document.getElementById('app'));
