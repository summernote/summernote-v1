import { Range } from "./types";
/**
 * `isCollapsed` checks if the range is collapsed.
 */
export function isCollapsed(range: Range): boolean {
  return range.s.length === range.e.length &&
    range.s.every((s, i) => s === range.e[i]);
}
