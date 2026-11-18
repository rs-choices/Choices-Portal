// Review marker: a thick red outline on everything this feature adds, so
// Ralph can see what is new. An outline, not a border, so the layout does not
// shift when it is removed. Remove every use (grep -rn NEW_MARK) and this
// file before committing, only when Ralph says so.
export const NEW_MARK = 'outline outline-[3px] outline-red-600 outline-offset-2 rounded-md';
