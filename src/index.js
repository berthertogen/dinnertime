import '../node_modules/bootstrap/scss/bootstrap.scss';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.scss';
import './styles.sass';
import { main as mainDinner } from './dinner.js';
import { main as mainNap } from './nap.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

await mainDinner();
await mainNap();
