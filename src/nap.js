import { DateTime } from "luxon";

async function getNaps() {
  const today = DateTime.now().toFormat("yyyy-MM-dd");
  const yesterday = DateTime.now().minus({days:1}).toFormat("yyyy-MM-dd");
  return await (await fetch(`/api/getnaps?today=${today}&yesterday=${yesterday}`)).json();
}

async function loadNaps(naps) {
  document.getElementById('naps').innerHTML = '';
  for (const nap of naps.naps) {
    const napFromDate = DateTime.fromISO(nap.from);
    const napTillDate = DateTime.fromISO(nap.till || DateTime.now().toISO());
    const timeNapped = napTillDate.diff(napFromDate, ['hours', 'minutes', 'seconds']);
    const timeNappedText = nap.sleeping ? `${timeNapped.toFormat("hh:mm:ss")}` : `${timeNapped.toFormat("hh:mm")} geslapen`;
    document.getElementById('naps').innerHTML += `
    <li class="list-group-item">
      <span>${timeNappedText}</span>
      <span>${napFromDate.toFormat("dd/MM/yyyy HH:mm")} ${nap.sleeping ? ''  : ` - ${napTillDate.toFormat("HH:mm")}`}</span>
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
  naps = await getNaps()
  await loadNaps(naps);
}
async function addNapStart() { await addNap('start'); }
async function addNapStop() { await addNap('stop'); }

let spinnerNapCtl;
let addNapCtl;
let naps = [];
export async function main() {
  spinnerNapCtl = document.getElementById('spinnerNap');
  addNapCtl = document.getElementById('addNapPnl');
  document.getElementById('addNapStart').addEventListener('click', addNapStart);
  document.getElementById('addNapStop').addEventListener('click', addNapStop);
  naps = await getNaps()
  await loadNaps(naps);
  
  setInterval(async () => {
    await loadNaps(naps);
  }, 1000);
  setInterval(async () => {
    naps = await getNaps()
    await loadNaps(naps);
  }, 30000);
}