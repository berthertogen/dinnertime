import { DateTime } from "luxon";

async function loadNaps() {
  const today = DateTime.now().toFormat("yyyy-MM-dd");
  const yesterday = DateTime.now().minus({days:1}).toFormat("yyyy-MM-dd");
  const naps = await (await fetch(`/api/getnaps?today=${today}&yesterday=${yesterday}`)).json();
  document.getElementById('naps').innerHTML = '';
  for (const nap of naps.naps) {
    const napFromDate = DateTime.fromISO(nap.from);
    const napTillDate = DateTime.fromISO(nap.till);
    const timeNapped = napTillDate.diff(napFromDate, ['hours', 'minutes']);
    const timeNappedText = nap.sleeping ? `${timeNapped.toFormat("hh:mm")} slapen <div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden">Loading...</span></div>` : `${timeNapped.toFormat("hh:mm")} geslapen`;
    document.getElementById('naps').innerHTML += `
    <li class="list-group-item">
    <span>${timeNappedText}</span>
    <span>${napFromDate.toFormat("dd/MM/yyyy HH:mm")} - ${nap.sleeping ? '...'  : napTillDate.toFormat("HH:mm")}</span>
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

let spinnerNapCtl;
let addNapCtl;
export async function main() {
  spinnerNapCtl = document.getElementById('spinnerNap');
  addNapCtl = document.getElementById('addNapPnl');
  document.getElementById('addNapStart').addEventListener('click', addNapStart);
  document.getElementById('addNapStop').addEventListener('click', addNapStop);
  await loadNaps();
  
  setTimeout(async () => {
    await loadNaps();
  }, 30000);
}