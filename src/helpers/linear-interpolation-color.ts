
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

const rgbToHex = (r: number, g: number, b: number) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

const rgbaToHex = (r: number, g: number, b: number, a: number) => {
  const alphaHex = Math.round(a * 255).toString(16).padStart(2, "0")
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}${alphaHex}`
}
const adjustHexAlpha = (hex: string, alphaFactor: number): string => {
  if (alphaFactor < 0 || alphaFactor > 1) {
    throw new Error("Alpha factor must be between 0 and 1")
  }

  const { r, g, b } = hexToRgb(hex)

  const adjustedAlpha = Math.max(0, Math.min(1, alphaFactor))

  return rgbaToHex(r, g, b, adjustedAlpha)
}

const generateColorArray = (
  length: number,
  startColor: string,
  endColor: string
): string[] => {

  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);

  // interpolate between startColor and endColor
  const result = Array.from({ length }, (_, index) => {
    const ratio = index / (length - 1); // calculate the ratio
    const r = Math.round(startRGB.r + ratio * (endRGB.r - startRGB.r));
    const g = Math.round(startRGB.g + ratio * (endRGB.g - startRGB.g));
    const b = Math.round(startRGB.b + ratio * (endRGB.b - startRGB.b));
    return rgbToHex(r, g, b);
  });

  return result;
}

const getColorByIndex = (
  index: number,
  length: number,
  startColor: string,
  endColor: string
) => {
  const startRGB = hexToRgb(startColor)
  const endRGB = hexToRgb(endColor)

  const ratio = index / (length - 1)  // calculate the ratio

  const r = Math.round(startRGB.r + ratio * (endRGB.r - startRGB.r))
  const g = Math.round(startRGB.g + ratio * (endRGB.g - startRGB.g))
  const b = Math.round(startRGB.b + ratio * (endRGB.b - startRGB.b))

  return rgbToHex(r, g, b);

}

export { getColorByIndex, hexToRgb, rgbToHex, adjustHexAlpha }