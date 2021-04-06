/** @param {number} size */
export function recamansSequence(size) {
  const used = new Uint8Array(size);
  const result = new Uint16Array(size);

  let i = 0;
  let a = 0;
  while (i < size) {
    result[i] = a;

    if (a - i >= 0 && used[a - i] !== 1) {
      a = a - i;
    } else {
      a = a + i;
    }

    used[a] = 1;
    i += 1;
  }

  return result;
}
