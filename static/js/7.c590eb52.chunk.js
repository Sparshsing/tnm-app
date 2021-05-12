(this["webpackJsonptnm-app"]=this["webpackJsonptnm-app"]||[]).push([[7],{187:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return S}));var o=n(45),a=n(0),r=n(249),i=n(213),c=n(199),s=n(250),u=n(211),p=n(246),d=n(196),h=n(214),l=n(239),j=n(140),f=n.n(j),m=n(188),b=n(106),y=n(198),O=n(46),T=n(200),g=n(197),v=n(1),k=n(3);function x(){return Object(k.jsxs)(m.a,{variant:"body2",color:"textSecondary",align:"center",children:["Copyright \xa9 ",Object(k.jsx)(d.a,{color:"inherit",href:"#",children:"SFM Dropshipping"})," ",(new Date).getFullYear(),"."]})}var C=Object(b.a)((function(e){return{paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},form:{width:"100%",marginTop:e.spacing(1)},submit:{margin:e.spacing(3,0,2)}}}));function S(){var e=C(),t=Object(a.useState)(""),n=Object(o.a)(t,2),j=n[0],b=n[1],S=Object(a.useState)(""),P=Object(o.a)(S,2),z=P[0],A=P[1],w=Object(a.useState)(""),N=Object(o.a)(w,2),E=N[0],J=N[1],G=Object(g.a)(["mr-token"]),U=Object(o.a)(G,2),D=U[0],L=U[1];Object(a.useEffect)((function(){console.log(D)}),[D]);return D["mr-token"]?Object(k.jsx)(v.a,{to:"/products"}):Object(k.jsxs)(y.a,{component:"main",maxWidth:"xs",children:[Object(k.jsx)(c.a,{}),Object(k.jsxs)("div",{className:e.paper,children:[Object(k.jsx)(r.a,{className:e.avatar,children:Object(k.jsx)(f.a,{})}),Object(k.jsx)(m.a,{component:"h1",variant:"h5",children:"Sign in"}),Object(k.jsxs)("form",{className:e.form,onSubmit:function(e){e.preventDefault(),O.b.signinUser({username:j,password:z}).then((function(e){e.token?L("mr-token",e.token):J("unable to contact server")})).catch((function(e){console.error(e),J("invalid username or password")}))},children:[E&&Object(k.jsx)(T.a,{error:!0,children:"Invalid username or password"}),Object(k.jsx)(s.a,{variant:"outlined",margin:"normal",required:!0,fullWidth:!0,id:"username",label:"Username",name:"username",value:j,autoComplete:"email",onChange:function(e){return b(e.target.value)},autoFocus:!0}),Object(k.jsx)(s.a,{variant:"outlined",margin:"normal",required:!0,fullWidth:!0,name:"password",label:"Password",type:"password",id:"password",value:z,onChange:function(e){return A(e.target.value)},autoComplete:"current-password"}),Object(k.jsx)(u.a,{control:Object(k.jsx)(p.a,{value:"remember",color:"primary"}),label:"Remember me"}),Object(k.jsx)(i.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:e.submit,children:"Sign In"}),Object(k.jsxs)(h.a,{container:!0,children:[Object(k.jsx)(h.a,{item:!0,xs:!0,children:Object(k.jsx)(d.a,{href:"#",variant:"body2",children:"Forgot password?"})}),Object(k.jsx)(h.a,{item:!0,children:Object(k.jsx)(d.a,{href:"#",variant:"body2",children:"Don't have an account? Sign Up"})})]})]})]}),Object(k.jsx)(l.a,{mt:8,children:Object(k.jsx)(x,{})})]})}},46:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return i}));var o=n(64),a=n(57),r="https://sfm-dropshipping.herokuapp.com",i=function(){function e(){Object(o.a)(this,e)}return Object(a.a)(e,null,[{key:"getProductList",value:function(e){return fetch(r+"/api/products/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getProduct",value:function(e,t){return fetch(r+"/api/products/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"addProduct",value:function(e,t){return fetch(r+"/api/products/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"updateProduct",value:function(e,t,n){return fetch(r+"/api/products/"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}},{key:"getStoreList",value:function(e){return fetch(r+"/api/stores/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getPurchasesList",value:function(e){return fetch(r+"/api/purchases/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getPurchase",value:function(e,t){return fetch(r+"/api/purchases/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"addPurchase",value:function(e,t){return fetch(r+"/api/purchases/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"updatePurchase",value:function(e,t,n){return fetch(r+"/api/purchases/"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}},{key:"getInventoryList",value:function(e){return fetch(r+"/api/inventory/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getOrderList",value:function(e){return fetch(r+"/api/orders/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getOrder",value:function(e,t){return fetch(r+"/api/orders/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"addOrder",value:function(e,t){return fetch(r+"/api/orders/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"updateOrder",value:function(e,t,n){return fetch(r+"/api/orders/"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}},{key:"signinUser",value:function(e){return fetch(r+"/auth/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then((function(e){return e.json()}))}}]),e}()}}]);
//# sourceMappingURL=7.c590eb52.chunk.js.map