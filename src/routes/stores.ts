import { DateTime } from 'luxon';
import { derived, writable } from 'svelte/store';

export const dinners = writable([]);
export const last3Dinners = derived(dinners, ($dinners) => {
  return $dinners
    .slice(0, 3)
    .map((dinner: any) => DateTime.fromISO(dinner).toFormat("cccc 'at' HH:mm"));
});
export const dinnersToday = derived(dinners, ($dinners) => {
  const today = DateTime.now().toFormat('yyyy-MM-dd');
  return $dinners.filter(
    (d: any) => DateTime.fromISO(d).toFormat('yyyy-MM-dd') === today
  ).length
});
export const lastDinnerAt = derived(dinners, ($dinners) => {
  const lastDinner = DateTime.fromISO($dinners[0]);
  return lastDinner.isValid ? lastDinner.toFormat('HH:mm') : 'N/A';
});
export const timeFromLastDinner = derived(dinners, ($dinners, set) => {
  const calc = () => {
    const lastDinner = DateTime.fromISO($dinners[0]);
    const x = lastDinner.isValid ? DateTime.now().diff(lastDinner, ['hours', 'minutes', 'seconds']).toFormat('hh:mm:ss') : 'N/A';
    set(x)
  };
  calc()
  const interval = setInterval(calc, 1000)
  return () => {
    clearInterval(interval)
  }
})

export const naps = writable([]);
const calNap = (nap: any) => {
  if (!nap) return 'N/A';
  const napFromDate = DateTime.fromISO(nap.from);
  const napTillDate = DateTime.fromISO(nap.till || DateTime.now().toISO());
  const timeNappedDiff = napTillDate.diff(napFromDate, ['hours', 'minutes', 'seconds']);
  return nap.sleeping ? timeNappedDiff.toFormat('hh:mm:ss') : timeNappedDiff.toFormat('hh:mm');
};
export const last3Naps = derived(naps, ($naps) => {
  return $naps
    .slice(0, 3)
    .map((nap: any) => ({
      from: DateTime.fromISO(nap.from).toFormat('cccc HH:mm'),
      till: nap.sleeping ? '...' : DateTime.fromISO(nap.till).toFormat('HH:mm'),
      sleeping: nap.sleeping,
      elapsed: nap.sleeping ? undefined : calNap(nap),
    })); 
});
export const napsToday = derived(naps, ($naps) => {
  const today = DateTime.now().toFormat('yyyy-MM-dd');
  return $naps.filter(
    (n: any) => n.sleeping || DateTime.fromISO(n.till).toFormat('yyyy-MM-dd') === today
  ).length
});
export const lastNap = derived(naps, ($naps) => {
  return $naps[0] as any;
});
export const lastNapElapsed = derived(naps, ($naps, set) => {
  const calc = () => set(calNap($naps[0]));
  const interval = setInterval(calc, 1000)
  calc()
  return () => {
    clearInterval(interval)
  }
});