import { DateTime } from "luxon";

async function loadDinners() {
  const today = DateTime.now().toFormat("yyyy-MM-dd");
  const yesterday = DateTime.now().minus({days:1}).toFormat("yyyy-MM-dd");
  const dinners = await (await fetch(`/api/getdinners?today=${today}&yesterday=${yesterday}`)).json();
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

let spinnerDinnerCtl;
let addDinnerCtl;
export async function main() {
  spinnerDinnerCtl = document.getElementById('spinnerDinner');
  addDinnerCtl = document.getElementById('addDinnerPnl');
  document.getElementById('addDinner').addEventListener('click', addDinner);
  await loadDinners();

  setInterval(async () => {
    await loadDinners();
  }, 30000);
}
