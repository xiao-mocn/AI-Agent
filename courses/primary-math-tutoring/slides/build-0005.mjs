import fs from 'node:fs/promises';
import path from 'node:path';
import {Presentation,PresentationFile} from '/Users/morongbao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const base=path.dirname(new URL(import.meta.url).pathname);
await fs.mkdir(path.join(base,'.build-0005'),{recursive:true});
const data=JSON.parse(await fs.readFile(path.join(base,'0005-clever-calculation-and-symbols-content.json'),'utf8'));
function tx(s,text,x,y,w,h,size,color='#203744',bold=false){const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=text;a.text.style={typeface:'PingFang SC',fontSize:size,color,bold};}
for(const edition of ['classroom']){
 const p=Presentation.create({slideSize:{width:1280,height:720}});
 const items=data;
 for(const [i,d] of items.entries()){
  const s=p.slides.add();s.background.fill='#FBF8F1';
  tx(s,d.kind,64,36,1040,40,21,'#126A70',true);tx(s,String(i+1).padStart(2,'0'),1160,36,65,40,20,'#647780');
  tx(s,d.title,64,104,1150,90,i===0?60:44,'#203744',true);
  const n=d.body.split('\n').length;tx(s,d.body,72,228,1136,394,d.kind==='封面'?38:n>6?31:n>4?34:38);
  s.speakerNotes.text='来源：'+d.source;
  tx(s,['例题','独立题','检测'].includes(d.kind)?'先独立思考，再说明依据与检查过程。':'数学思维 · 加减巧算与巧添符号',72,660,1136,30,18,'#647780');
 }
 const file=path.join(base,'.build-0005',`candidate-${edition}.pptx`);
 await(await PresentationFile.exportPptx(p)).save(file);
 console.log(JSON.stringify({版本:edition,页数:items.length,路径:file}));
}
