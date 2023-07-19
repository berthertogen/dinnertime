import '../node_modules/bootstrap/scss/bootstrap.scss';
import './styles.sass';
import { main as mainDinner } from './dinner.js';
import { main as mainNap } from './nap.js';

await mainDinner();
await mainNap();
