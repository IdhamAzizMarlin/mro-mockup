'use strict';
// Progress is explicit and belongs to one project. Importing data never approves it.
globalThis.MROReviewState = (() => {
  function first(state) { const i=state.done.findIndex(v=>!v); return i<0?state.done.length:i; }
  function canOpen(state,i) { return Number.isInteger(i)&&i>=0&&i<state.done.length&&i<=first(state); }
  function canEdit(state,i) { return canOpen(state,i)&&!state.done[i]&&i===first(state); }
  function load(db,id,defs) {
    db.projectReviews ||= {};
    let state=db.projectReviews[id];
    if(!state||!Array.isArray(state.done)||state.done.length!==defs.length) {
      state={done:defs.map(()=>false),rows:defs.map(s=>structuredClone(s.rows)),source:defs.map(()=> 'Data contoh untuk review client')};
      db.projectReviews[id]=state;
    }
    let gap=false;
    state.done=state.done.map(v=>{if(v!==true)gap=true;return !gap;});
    if(!Array.isArray(state.rows))state.rows=[];
    if(!Array.isArray(state.source))state.source=[];
    defs.forEach((def,i)=>{
      if(!Array.isArray(state.rows[i])||!state.rows[i].every(r=>Array.isArray(r)&&r.length===def.columns.length))state.rows[i]=structuredClone(def.rows);
      if(typeof state.source[i]!=='string')state.source[i]='Data contoh untuk review client';
    });
    return state;
  }
  function finish(state,i) { if(!canEdit(state,i))return false;state.done[i]=true;return true; }
  function reopen(state,i) { if(!canOpen(state,i)||!state.done[i])return false;state.done.fill(false,i);return true; }
  function applyImport(state,i,rows,name,mode) {
    if(!canEdit(state,i))return false;
    state.rows[i]=mode==='replace'?structuredClone(rows):[...state.rows[i],...structuredClone(rows)];
    state.source[i]=name+' · simulasi';return true;
  }
  return {load,first,canOpen,canEdit,finish,reopen,applyImport};
})();
