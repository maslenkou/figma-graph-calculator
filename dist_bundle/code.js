(()=>{"use strict";figma.showUI(__html__,{themeColors:!0,width:382,height:420}),void 0!==figma.currentPage.selection[0]&&"FRAME"===figma.currentPage.selection[0].type||(figma.notify("Please select a frame to run the plugin",{timeout:4e3,error:!0}),figma.closePlugin()),figma.ui.onmessage=e=>{if("insertGraph"===e.type&&void 0!==figma.currentPage.selection[0]){const t=figma.currentPage.selection[0];null!=e.coordinatesArray&&0!=e.coordinatesArray.length||figma.notify("Expression cannot be parsed. Please try again",{timeout:4e3,error:!0});const i=t.width/100,r=e.coordinatesArray.map((e=>({x:e.x*i,y:e.y*i}))),o=.2;let n=[],a=0,s=0;for(const e in r){const t=r[e].y;s+=1,t<0?a+=1:t>0&&(a-=1)}n=a===s-1?r.filter((e=>e.y>=-t.height)):a===1-s?r.filter((e=>e.y<=t.height)):r.filter((e=>Math.abs(e.y)<=t.height/2));const g=[];for(let e=1;e<n.length-1;e++){const t=n[e-1].x-n[e+1].x,i=n[e-1].y-n[e+1].y,r={x:n[e].x-t*o,y:n[e].y-i*o},a={x:n[e].x+t*o,y:n[e].y+i*o};g[e]=[],g[e].push(r),g[e].push(a)}let h=`M ${n[0].x} ${n[0].y} Q ${g[1][1].x} ${g[1][1].y} ${n[1].x} ${n[1].y}`;if(n.length>2){for(let e=1;e<n.length-2;e++)h+=` C ${g[e][0].x} ${g[e][0].y} ${g[e+1][1].x} ${g[e+1][1].y} ${n[e+1].x} ${n[e+1].y}`;const e=n.length-1;h+=` Q ${g[e-1][0].x} ${g[e-1][0].y} ${n[e].x} ${n[e].y}`}const l=figma.createVector();l.vectorPaths=[{windingRule:"NONE",data:h}],l.handleMirroring="ANGLE_AND_LENGTH",l.constrainProportions=!0,"FRAME"===t.type&&(t.appendChild(l),l.x=Math.round((t.width-l.width)/2),l.y=Math.round((t.height-l.height)/2)),figma.notify("Graph successfully inserred",{timeout:4e3,error:!1}),figma.closePlugin()}else figma.notify("Please keep a frame selected to insert a graph",{timeout:4e3,error:!0})}})();