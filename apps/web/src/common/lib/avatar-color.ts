export function avatarHue(name: string): number {
  return (name.charCodeAt(0) * 37) % 360;
}

export function avatarBg(name: string): string {
  return `oklch(0.82 0.04 ${avatarHue(name)})`;
}
