const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const nodes=new Map();
const node=id=>{if(!nodes.has(id))nodes.set(id,{id,innerHTML:'',textContent:'',addEventListener(){},classList:{toggle(){}},focus(){}});return nodes.get(id)};
const context={structuredClone,Blob,console,setTimeout,clearTimeout,location:{hash:''},storageOK:true,
 document:{getElementById:node,querySelectorAll:()=>[],querySelector:()=>null},window:{addEventListener(){}},
 db:{projects:[],categories:{},findings:[],checks:{},inspectionRows:{}},types:{W1:'Awal',W2:'Perubahan',W3:'Realisasi',W4:'Barang Sisa'},route:['project','A','verification'],
 inspectionDefinitions:Array.from({length:7},()=>({columns:['A','B'],rows:[]})),
 head:()=>'',btn:()=>'',badge:()=>'',save(){},toast(){},log(){},go(){},summary:()=>'',findings:()=>'',result:()=>''};
vm.createContext(context);
for(const name of ['review-state.js','project-review.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js',name),'utf8'),context);
const RV=context.RV;
const p={id:'A',w:'W2',name:'PT Contoh',location:'Workshop',owner:'Verifier',status:'Aktif',result:'Belum',official:'Belum',ref:'REF'};
RV.mount(p,'verification');RV.finishStep();
RV.beginImport();RV.ui.importName='test.xlsx';RV.ui.importStep=2;RV.applyImport();RV.ui.importStep=0;
const imported=JSON.stringify(RV.state.rows[1]);
RV.changeCategory('Penambahan jenis barang');
RV.changeCategory('Jumlah rencana impor');
assert.equal(JSON.stringify(RV.state.rows[1]),imported,'Changing W2 category must retain previously imported rows');
assert.equal(RV.state.done[1],false,'Category/import actions do not complete a step');
assert.match(RV.bind('<button onclick="openStep(0);ui.query=\'\'">Go</button>'),/RV.openStep\(0\);RV.ui.query/);
const fresh=RV.mount({...p,id:'B',w:'W1',fresh:true},'documentation');
assert.match(fresh,/Dokumentasi kegiatan belum tersedia/,'New projects show an honest empty state');
assert.equal(RV.state.documents.filter(d=>d.file).length,0,'No synthetic availability on new registrations');
context.db.inspectionRows['C|0']=[['Legacy','Retained']];
RV.mount({...p,id:'C',w:'W1'},'inspection');
assert.equal(RV.state.rows[0][0][0],'Legacy','Migrate legacy W1 rows without overwriting them');
assert.equal(RV.ui.tab,'verification','Legacy inspection links still work');
RV.mount(p,'findings');assert.equal(RV.ui.tab,'summary','Legacy findings are available on Summary');
assert.equal(RV.state.rows[1].length,4,'Project-specific state survives switching projects');
console.log('PASS: W2 data retention, scoped handlers, fresh projects, legacy rows/routes, project switching');
