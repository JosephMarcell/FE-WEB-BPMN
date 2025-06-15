export function renderLargaData(number: number | undefined | null) {
  return number ? number.toLocaleString('id-ID') : 0;
}
