import '../node_modules/bootstrap/scss/bootstrap.scss';
import './styles.sass';
import { DateTime } from "luxon";

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
      <span>${dinnerDate.toFormat("dd/MM/yyyy HH:mm")}</span>
      <span>${timeFromText}</span>
    </li>`;
  }
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