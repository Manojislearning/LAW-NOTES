'use strict';
const {Plugin,ItemView,TFile,Notice}=require('obsidian');
const VIEW='law-mindbranches';
const NS='http://www.w3.org/2000/svg';
const PALETTE=['#2184d0','#eb8931','#3ba56b','#da5653','#8760c6','#13a3a8','#c8a13d'];
const clean=s=>String(s||'').replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g,'$2').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[*_\x60~]/g,'').replace(/\s+/g,' ').trim();
const make=(name,path)=>({name:clean(name)||'Untitled',path:path||'',children:[],closed:false});
const label=f=>f.basename.replace(/^\d{2}\s*[-–]\s*/,'');
const docs=(app,dir)=>app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(dir+'/')&&!f.path.slice(dir.length+1).includes('/')).sort((a,b)=>a.basename.localeCompare(b.basename,undefined,{numeric:true}));
const unitFolder=p=>(p.match(/^(.*\/Units\/Unit-\d{2})(?:\/|$)/)||[])[1];
const subjectFolder=p=>(p.match(/^(\d{2}-Semester-\d+\/[^/]+)/)||[])[1];
const semesterFolder=p=>(p.match(/^(\d{2}-Semester-\d+)/)||[])[1]||'01-Semester-1';
const unitFolders=(app,subject)=>[...new Set(app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(subject+'/Units/')).map(f=>f.path.slice((subject+'/Units/').length).split('/')[0]).filter(f=>/^Unit-\d{2}$/.test(f)))].sort();
function parse(app,file,content){
 const root=make(label(file),file.path),stack=[{level:0,item:root}];
 let head=0,code=false,limit=0;
 const data=content.replace(/^---\r?\n[\s\S]*?\r?\n---\s*\r?\n/,'');
 for(const line of data.split(/\r?\n/)){
  if(/^\s*(\x60{3,}|~{3,})/.test(line)){code=!code;continue;}
  if(code||/^\s*>/.test(line))continue;
  const h=line.match(/^(#{1,6})\s+(.+)$/),b=line.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.+)$/);
  if(!h&&!b)continue;
  if(h&&h[1].length===1){root.name=clean(h[2]);stack.length=1;head=1;continue;}
  if(++limit>320)break;
  const level=h?h[1].length*10:head*10+1+Math.floor(b[1].replace(/\t/g,'  ').length/2);
  if(h)head=h[1].length;
  const raw=h?h[2]:b[2].replace(/^\[[xX ]\]\s*/,'');
  const entry=make(raw);
  const link=raw.match(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]+)?\]\]/);
  if(link){
   const target=app.metadataCache.getFirstLinkpathDest(link[1],file.path);
   if(target instanceof TFile)entry.path=target.path;
  }
  while(stack.length>1&&stack[stack.length-1].level>=level)stack.pop();
  stack[stack.length-1].item.children.push(entry);
  stack.push({level,item:entry});
 }
 return root;
}
async function unit(app,dir,deep){
 const files=docs(app,dir),index=files.find(f=>f.basename.startsWith('00'));
 const md=index?await app.vault.cachedRead(index):'';
 const title=(md.match(/^#\s+(.+)$/m)||[])[1]||dir.split('/').pop();
 const root=make(title,index&&index.path);
 for(const f of files){
  if(f===index)continue;
  const child=make(label(f),f.path);
  if(deep){
   const detail=parse(app,f,await app.vault.cachedRead(f));
   child.name=detail.name;child.children=detail.children.slice(0,24);
   child.closed=child.children.length>0;
  }
  root.children.push(child);
 }
 return root;
}
async function subject(app,dir){
 const home=docs(app,dir).find(f=>f.basename.startsWith('00')&&!/Books/i.test(f.basename));
 const root=make(dir.split('/').pop().replace(/---/g,' · ').replace(/-/g,' '),home&&home.path);
 for(const u of unitFolders(app,dir)){const child=await unit(app,dir+'/Units/'+u,false);child.closed=true;root.children.push(child);}
 return root;
}
async function semester(app,dir){
 const root=make('KSLU LL.B. · '+(dir.endsWith('1')?'Semester I':'Semester II'));
 const prefix=dir+'/';
 const names=[...new Set(app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(prefix)).map(f=>f.path.slice(prefix.length).split('/')[0]))].sort();
 for(const name of names){const folder=dir+'/'+name;if(!unitFolders(app,folder).length)continue;const child=await subject(app,folder);child.closed=true;root.children.push(child);}
 return root;
}
async function loadTree(app,file,scope){
 if(!(file instanceof TFile))return make('Open a Markdown law note first');
 if(scope==='semester')return semester(app,semesterFolder(file.path));
 if(scope==='subject'&&subjectFolder(file.path))return subject(app,subjectFolder(file.path));
 if(scope==='unit'&&unitFolder(file.path))return unit(app,unitFolder(file.path),true);
 return parse(app,file,await app.vault.cachedRead(file));
}
const svg=(name,attr,parent)=>{
 const element=document.createElementNS(NS,name);
 Object.entries(attr||{}).forEach(([k,v])=>element.setAttribute(k,String(v)));
 if(parent)parent.appendChild(element);
 return element;
};
class MapView extends ItemView{
 constructor(leaf){super(leaf);this.path='';this.scope='unit';this.font=20;this.wrap=false;this.root=null;this.version=0;this.zoom=1;this.x=0;this.y=0;}
 getViewType(){return VIEW;}
 getDisplayText(){return 'Law Notes · MindBranches';}
 getIcon(){return 'git-branch';}
 getState(){return {path:this.path,scope:this.scope};}
 async setState(state,result){this.path=state.path||this.path;this.scope=state.scope||this.scope;await super.setState(state,result);await this.reload();}
 async onOpen(){
  const shell=this.contentEl.createDiv({cls:'lmb-shell'});
  this.toolbar=shell.createDiv({cls:'lmb-toolbar'});
  shell.createDiv({cls:'lmb-hint',text:'Click a circle to fold · Click linked title to open note · Drag to pan · Ctrl+scroll to zoom'});
  this.frame=shell.createDiv({cls:'lmb-frame'});
  this.canvas=svg('svg',{class:'lmb-canvas','aria-label':'Colored law study branches'},this.frame);
  this.group=svg('g',{},this.canvas);
  this.canvas.addEventListener('wheel',e=>{
   e.preventDefault();
   if(e.ctrlKey||e.metaKey){
    const bounds=this.canvas.getBoundingClientRect(),px=e.clientX-bounds.left,py=e.clientY-bounds.top;
    const z=Math.max(.1,Math.min(3,this.zoom*Math.exp(-e.deltaY*.002)));
    const ratio=z/this.zoom;this.x=px-(px-this.x)*ratio;this.y=py-(py-this.y)*ratio;this.zoom=z;
   }else{this.x-=e.deltaX;this.y-=e.deltaY;}
   this.transform();
  },{passive:false});
  this.canvas.addEventListener('pointerdown',e=>{
   if(e.button!==0||e.target.closest('.lmb-node'))return;
   this.drag={x:e.clientX,y:e.clientY,ox:this.x,oy:this.y};this.canvas.setPointerCapture(e.pointerId);
  });
  this.canvas.addEventListener('pointermove',e=>{if(!this.drag)return;this.x=this.drag.ox+e.clientX-this.drag.x;this.y=this.drag.oy+e.clientY-this.drag.y;this.transform();});
  this.canvas.addEventListener('pointerup',()=>{this.drag=null;});
  this.canvas.addEventListener('pointercancel',()=>{this.drag=null;});
  await this.reload();
 }
 async onClose(){this.version++;this.contentEl.empty();}
 button(text,fn){const button=this.toolbar.createEl('button',{text,attr:{type:'button'}});button.addEventListener('click',fn);return button;}
 async reload(){
  if(!this.toolbar)return;
  const v=++this.version;this.toolbar.empty();
  this.toolbar.createEl('strong',{text:'MindBranches'});
  const scope=this.toolbar.createEl('select',{attr:{'aria-label':'Map scope'}});
  [['note','This note'],['unit','Unit'],['subject','Subject'],['semester','Semester']].forEach(([key,text])=>{
   const opt=scope.createEl('option',{text,value:key});opt.selected=key===this.scope;
  });
  scope.addEventListener('change',()=>{this.scope=scope.value;this.reload();});
  const font=this.toolbar.createEl('select',{attr:{'aria-label':'Text size'}});
  [16,20,24,28].forEach(size=>{const opt=font.createEl('option',{text:size+' px',value:String(size)});opt.selected=size===this.font;});
  font.addEventListener('change',()=>{this.font=Number(font.value);this.render(true);});
  const wrap=this.button(this.wrap?'One line':'Wrap text',()=>{this.wrap=!this.wrap;wrap.textContent=this.wrap?'One line':'Wrap text';this.render(true);});
  this.button('Fit',()=>this.fit());this.button('Refresh',()=>this.reload());
  const file=this.app.vault.getAbstractFileByPath(this.path)||this.app.workspace.getActiveFile();
  if(file instanceof TFile)this.path=file.path;
  try{const root=await loadTree(this.app,file,this.scope);if(v!==this.version)return;this.root=root;this.render(true);}
  catch(err){console.error('Law MindBranches',err);new Notice('Could not load branch map: '+err.message);}
 }
 transform(){this.group.setAttribute('transform','translate('+this.x+' '+this.y+') scale('+this.zoom+')');}
 fit(){
  if(!this.bounds)return;const w=this.frame.clientWidth||900,h=this.frame.clientHeight||650;
  this.zoom=Math.max(.08,Math.min(1.3,(w-110)/this.bounds.w,(h-90)/this.bounds.h));
  this.x=(w-this.bounds.w*this.zoom)/2+20*this.zoom;this.y=(h-this.bounds.h*this.zoom)/2+20*this.zoom;this.transform();
 }
 render(reset){
  if(!this.root||!this.group)return;this.group.replaceChildren();
  const ctx=document.createElement('canvas').getContext('2d');
  ctx.font='400 '+this.font+'px system-ui';
  const columns=[],visible=[];
  const layout=(n,d,c)=>{
   n.depth=d;n.color=c;
   if(!this.wrap)n.lines=[n.name];
   else{
    n.lines=[];let current='';
    for(const word of n.name.split(' ')){
     const next=current?current+' '+word:word;
     if(current&&ctx.measureText(next).width>320){n.lines.push(current);current=word;}else current=next;
    }
    if(current)n.lines.push(current);
   }
   n.width=Math.max(55,...n.lines.map(t=>ctx.measureText(t).width))+22;
   n.height=n.lines.length*this.font*1.3+22;columns[d]=Math.max(columns[d]||0,n.width);
   if(!n.closed&&d<12)n.children.forEach((child,i)=>layout(child,d+1,d===0?PALETTE[i%PALETTE.length]:c));
  };
  layout(this.root,0,PALETTE[0]);
  const xpos=[25];for(let i=1;i<columns.length;i++)xpos[i]=xpos[i-1]+columns[i-1]+100;
  const span=n=>{const children=n.closed?[]:n.children;n.span=Math.max(n.height+20,children.reduce((v,child)=>v+span(child),0)+Math.max(0,children.length-1)*13);return n.span;};
  span(this.root);
  const position=(n,top)=>{
   n.x=xpos[n.depth];n.y=top+n.span/2;visible.push(n);
   if(n.closed)return;
   const total=n.children.reduce((v,child)=>v+child.span,0)+Math.max(0,n.children.length-1)*13;
   let cursor=top+(n.span-total)/2;n.children.forEach(child=>{position(child,cursor);cursor+=child.span+13;});
  };position(this.root,0);
  this.bounds={w:Math.max(...visible.map(n=>n.x+n.width))+45,h:this.root.span+35};
  const paths=svg('g',{},this.group);
  visible.forEach(n=>{if(n.closed)return;n.children.forEach(child=>{
    const from=n.x+n.width-7,to=child.x-11,middle=(from+to)/2;
    svg('path',{d:'M '+from+' '+n.y+' C '+middle+' '+n.y+' '+middle+' '+child.y+' '+to+' '+child.y,fill:'none',stroke:child.color,'stroke-width':2.6,'stroke-linecap':'round'},paths);
  });});
  const labels=svg('g',{},this.group);
  visible.forEach(n=>{
   const g=svg('g',{class:'lmb-node'},labels),lh=this.font*1.3;
   n.lines.forEach((line,i)=>{
    const t=svg('text',{x:n.x,y:n.y+(i-(n.lines.length-1)/2)*lh,'font-size':this.font,
      'font-weight':n.depth===0?750:n.depth===1?650:400,fill:'var(--text-normal)','dominant-baseline':'middle'},g);
    t.textContent=line;
    if(n.path){t.setAttribute('class','lmb-open');t.addEventListener('click',()=>this.openNote(n.path));}
   });
   const y=n.y+n.lines.length*lh/2+5;
   svg('line',{x1:n.x,y1:y,x2:n.x+n.width-10,y2:y,stroke:n.color,'stroke-width':n.depth===0?4:2},g);
   if(n.children.length){
    const circle=svg('circle',{cx:n.x-13,cy:n.y,r:7,fill:n.closed?'var(--background-primary)':n.color,stroke:n.color,'stroke-width':2.5,class:'lmb-fold'},g);
    circle.addEventListener('click',()=>{n.closed=!n.closed;this.render(true);});
    if(n.closed)svg('path',{d:'M '+(n.x-16)+' '+n.y+' h6 M '+(n.x-13)+' '+(n.y-3)+' v6',stroke:n.color,'stroke-width':1.5,'pointer-events':'none'},g);
   }
  });
  if(reset)this.fit();else this.transform();
 }
 async openNote(path){
  const file=this.app.vault.getAbstractFileByPath(path);
  if(!(file instanceof TFile)){new Notice('Note not found');return;}
  const leaf=this.app.workspace.getLeaf('split','vertical');await leaf.openFile(file);await this.app.workspace.revealLeaf(leaf);
 }
}
class LawMindBranches extends Plugin{
 async onload(){
  this.registerView(VIEW,leaf=>new MapView(leaf));
  this.addRibbonIcon('git-branch','Open MindBranches',()=>this.open('unit'));
  for(const [scope,title]of [['note','Open current note branches'],['unit','Open unit MindBranches'],['subject','Open subject MindBranches'],['semester','Open semester MindBranches']]){
   this.addCommand({id:'open-'+scope+'-branches',name:title,callback:()=>this.open(scope)});
  }
  this.registerEvent(this.app.workspace.on('file-open',file=>{
   if(!(file instanceof TFile))return;
   this.app.workspace.getLeavesOfType(VIEW).forEach(leaf=>{const view=leaf.view;if(view instanceof MapView&&view.path!==file.path){view.path=file.path;view.reload();}});
  }));
  this.registerEvent(this.app.vault.on('modify',file=>{
   if(!(file instanceof TFile))return;clearTimeout(this.timer);
   this.timer=setTimeout(()=>this.app.workspace.getLeavesOfType(VIEW).forEach(leaf=>{if(leaf.view instanceof MapView)leaf.view.reload();}),700);
  }));
 }
 async open(scope){
  const previous=this.app.workspace.getLeavesOfType(VIEW)[0];
  const file=this.app.workspace.getActiveFile();
  const leaf=previous||this.app.workspace.getLeaf('tab');
  await leaf.setViewState({type:VIEW,active:true,state:{scope,path:file&&file.path||previous&&previous.view.path||''}});
  await this.app.workspace.revealLeaf(leaf);
 }
 onunload(){clearTimeout(this.timer);this.app.workspace.detachLeavesOfType(VIEW);}
}
module.exports=LawMindBranches;
module.exports.default=LawMindBranches;
