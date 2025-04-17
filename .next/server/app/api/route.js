"use strict";(()=>{var e={};e.id=755,e.ids=[755],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6596:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>c,originalPathname:()=>l,requestAsyncStorage:()=>p,routeModule:()=>n,serverHooks:()=>u,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>E});var s={};t.r(s),t.d(s,{DELETE:()=>DELETE,GET:()=>GET,PUT:()=>PUT}),t(8976);var o=t(884),a=t(6132),i=t(5798);async function GET(e,{params:r}){try{let e=process.env.DB,t=r.id,s=await e.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(t).first();if(!s)return i.Z.json({error:"Post not found"},{status:404});return i.Z.json(s)}catch(e){return console.error("Error fetching post:",e),i.Z.json({error:"Failed to fetch post"},{status:500})}}async function PUT(e,{params:r}){try{let t=process.env.DB,s=r.id,o=await e.json(),a=await t.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(s).first();if(!a)return i.Z.json({error:"Post not found"},{status:404});let n=Date.now(),p=`
      UPDATE Posts SET
        title = ?,
        description = ?,
        mediaType = ?,
        mediaUrl = ?,
        grades = ?,
        subjects = ?,
        approaches = ?,
        updatedAt = ?
      WHERE id = ?
    `,d=[o.title||a.title,o.description||a.description,o.mediaType||a.mediaType,o.mediaUrl||a.mediaUrl,o.grades||a.grades,o.subjects||a.subjects,o.approaches||a.approaches,n,s];await t.prepare(p).bind(...d).run();let u=await t.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(s).first();return i.Z.json(u)}catch(e){return console.error("Error updating post:",e),i.Z.json({error:"Failed to update post"},{status:500})}}async function DELETE(e,{params:r}){try{let e=process.env.DB,t=r.id,s=await e.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(t).first();if(!s)return i.Z.json({error:"Post not found"},{status:404});return await e.prepare(`
      DELETE FROM Posts WHERE id = ?
    `).bind(t).run(),i.Z.json({success:!0})}catch(e){return console.error("Error deleting post:",e),i.Z.json({error:"Failed to delete post"},{status:500})}}let n=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/route",pathname:"/api",filename:"route",bundlePath:"app/api/route"},resolvedPagePath:"/Users/blair.dupre/Downloads/App Development Requirements Analysis-3/src/app/api/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:u,headerHooks:c,staticGenerationBailout:E}=n,l="/api/route"}};var r=require("../../webpack-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),t=r.X(0,[955],()=>__webpack_exec__(6596));module.exports=t})();