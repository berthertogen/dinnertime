import '../node_modules/bootstrap/scss/bootstrap.scss';
import './styles.sass';
import { DateTime } from "luxon";

const spinnerDinnerCtl = document.getElementById('spinnerDinner');
const addDinnerCtl = document.getElementById('addDinnerPnl');

async function loadDinners() {
  const dinners = await (await fetch(`/api/getdinners`)).json();
  document.getElementById('dinners').innerHTML = '';
  for (const dinner of dinners) {
    const now = DateTime.now();
    const dinnerDate = DateTime.fromISO(dinner);
    const timeFrom = now.diff(dinnerDate, ['hours', 'minutes']);
    const timeFromText = timeFrom.toFormat("hh:mm");
    document.getElementById('dinners').innerHTML += `
    <li class="list-group-item">
    <span>${timeFromText} geleden</span>
    <span>${dinnerDate.toFormat("dd/MM/yyyy HH:mm")}</span>
    </li>`;
  }
  spinnerDinnerCtl.classList.add('d-none');
  addDinnerCtl.classList.remove('d-none');
}
async function addDinner() {
  const time = document.getElementById('dinnerTime').value || DateTime.now().toFormat("HH:mm");
  const datetime = DateTime.fromFormat(time, "HH:mm");
  await fetch(`/api/postdinner`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datetime.toISO())
  })
  document.getElementById('dinnerTime').value = '';
  await loadDinners();
}
await loadDinners();
document.getElementById('addDinner').addEventListener('click', addDinner);

const spinnerNapCtl = document.getElementById('spinnerNap');
const addNapCtl = document.getElementById('addNapPnl');

async function loadNaps() {
  const naps = await (await fetch(`/api/getnaps`)).json();
  document.getElementById('naps').innerHTML = '';
  for (const nap of naps) {
    const now = DateTime.now();
    const dinnerDate = DateTime.fromISO(nap.time);
    const timeFrom = now.diff(dinnerDate, ['hours', 'minutes']);
    const timeFromText = timeFrom.toFormat("hh:mm");
    document.getElementById('naps').innerHTML += `
    <li class="list-group-item">
    <span>${timeFromText} geleden</span>
    <span>${nap.type}</span>
    <span>${dinnerDate.toFormat("dd/MM/yyyy HH:mm")}</span>
    </li>`;
  }
  spinnerNapCtl.classList.add('d-none');
  addNapCtl.classList.remove('d-none');
}
async function addNap(startStop) {
  const time = DateTime.now().toFormat("HH:mm");
  const datetime = DateTime.fromFormat(time, "HH:mm");
  await fetch(`/api/postnap${startStop}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datetime.toISO())
  })
  document.getElementById('dinnerTime').value = '';
  await loadNaps();
}
async function addNapStart() { await addNap('start'); }
async function addNapStop() { await addNap('stop'); }
await loadNaps();
document.getElementById('addNapStart').addEventListener('click', addNapStart);
document.getElementById('addNapStop').addEventListener('click', addNapStop);