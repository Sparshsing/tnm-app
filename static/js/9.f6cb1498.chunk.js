(this["webpackJsonptnm-app"]=this["webpackJsonptnm-app"]||[]).push([[9],{211:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return C}));var o=n(44),a=n(0),i=n(282),r=n(235),c=n(158),u=n(283),s=n(233),p=n(279),h=n(220),d=n(273),l=n(159),f=n.n(l),y=n(212),m=n(122),T=n(157),j=n(46),k=n(222),b=n(221),v=n(1),O=n(3);function g(){return Object(O.jsxs)(y.a,{variant:"body2",color:"textSecondary",align:"center",children:["Copyright \xa9 ",Object(O.jsx)(h.a,{color:"inherit",href:"#",children:"SFM Dropshipping"})," ",(new Date).getFullYear(),"."]})}var S=Object(m.a)((function(e){return{paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},form:{width:"100%",marginTop:e.spacing(1)},submit:{margin:e.spacing(3,0,2)}}}));function C(){var e=S(),t=Object(a.useState)(""),n=Object(o.a)(t,2),h=n[0],l=n[1],m=Object(a.useState)(""),C=Object(o.a)(m,2),P=C[0],A=C[1],z=Object(a.useState)(""),x=Object(o.a)(z,2),E=x[0],w=x[1],N=Object(a.useState)(!1),J=Object(o.a)(N,2),G=J[0],L=J[1],_=Object(b.a)(["mr-token"]),D=Object(o.a)(_,2),U=D[0],F=D[1],I=Object(b.a)(["mr-user"]),W=Object(o.a)(I,2),q=W[0],M=W[1];Object(a.useEffect)((function(){}),[U,q]);return U["mr-token"]?Object(O.jsx)(v.a,{to:"/"}):G?Object(O.jsx)("p",{children:"Loading... Please wait."}):Object(O.jsxs)(T.a,{component:"main",maxWidth:"xs",children:[Object(O.jsx)(c.a,{}),Object(O.jsxs)("div",{className:e.paper,children:[Object(O.jsx)(i.a,{className:e.avatar,children:Object(O.jsx)(f.a,{})}),Object(O.jsx)(y.a,{component:"h1",variant:"h5",children:"Sign in"}),Object(O.jsxs)("form",{className:e.form,onSubmit:function(e){e.preventDefault(),L(!0),j.b.signinUser({username:h,password:P}).then((function(e){if(200==e.status)return e.json();throw 400==e.status?"Invalid username or passord":"Something went wrong"})).then((function(e){L(!1);var t=0;e.is_superuser?t=1:e.is_staff&&(t=2),M("mr-user","".concat(e.user_id,"-").concat(t)),F("mr-token",e.token)})).catch((function(e){console.error(e),w(String(e)),L(!1)}))},children:[E&&Object(O.jsx)(k.a,{error:!0,children:E}),Object(O.jsx)(u.a,{variant:"outlined",margin:"normal",required:!0,fullWidth:!0,id:"username",label:"Username",name:"username",value:h,autoComplete:"email",onChange:function(e){return l(e.target.value)},autoFocus:!0}),Object(O.jsx)(u.a,{variant:"outlined",margin:"normal",required:!0,fullWidth:!0,name:"password",label:"Password",type:"password",id:"password",value:P,onChange:function(e){return A(e.target.value)},autoComplete:"current-password"}),Object(O.jsx)(s.a,{control:Object(O.jsx)(p.a,{value:"remember",color:"primary"}),label:"Remember me"}),Object(O.jsx)(r.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:e.submit,children:"Sign In"})]})]}),Object(O.jsx)(d.a,{mt:8,children:Object(O.jsx)(g,{})})]})}},46:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return r}));var o=n(74),a=n(66),i="https://sfm-dropshipping.herokuapp.com",r=function(){function e(){Object(o.a)(this,e)}return Object(a.a)(e,null,[{key:"getProductList",value:function(e){return fetch(i+"/api/products/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"getProduct",value:function(e,t){return fetch(i+"/api/products/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"addProduct",value:function(e,t){return fetch(i+"/api/products/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"updateProduct",value:function(e,t,n){return fetch(i+"/api/products/"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}},{key:"deleteProduct",value:function(e,t){return fetch(i+"/api/products/"+t+"/",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"getStoreList",value:function(e){return fetch(i+"/api/stores/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"getPurchasesList",value:function(e){return fetch(i+"/api/purchases/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"getPurchase",value:function(e,t){return fetch(i+"/api/purchases/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"addPurchase",value:function(e,t){return fetch(i+"/api/purchases/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"updatePurchase",value:function(e,t,n){return fetch(i+"/api/purchases/"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}},{key:"deletePurchase",value:function(e,t){return fetch(i+"/api/purchases/"+t+"/",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"getInventoryList",value:function(e){return fetch(i+"/api/inventory/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getOrderList",value:function(e){return fetch(i+"/api/orders/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getPrintingList",value:function(e){return fetch(i+"/api/printing/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}}).then((function(e){return e.json()}))}},{key:"getOrder",value:function(e,t){return fetch(i+"/api/orders/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"addOrder",value:function(e,t){return fetch(i+"/api/orders/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"deleteOrder",value:function(e,t){return fetch(i+"/api/orders/"+t+"/",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"updateOrder",value:function(e,t,n){return fetch(i+"/api/orders/"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}},{key:"getInvoiceList",value:function(e){return fetch(i+"/api/invoices/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"getInvoice",value:function(e,t){return fetch(i+"/api/invoices/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"generateInvoices",value:function(e,t){return fetch(i+"/api/invoices/generate_invoices/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"uploadOrdersFile",value:function(e,t){return fetch(i+"/api/orders/import_ordersfile/",{method:"POST",headers:{Authorization:"Token ".concat(e)},body:t})}},{key:"uploadShippingFile",value:function(e,t){return fetch(i+"/api/orders/import_shippingfile/",{method:"POST",headers:{Authorization:"Token ".concat(e)},body:t})}},{key:"uploadPurchasesFile",value:function(e,t){return fetch(i+"/api/purchases/import_file/",{method:"POST",headers:{Authorization:"Token ".concat(e)},body:t})}},{key:"uploadProductsFile",value:function(e,t){return fetch(i+"/api/products/import_file/",{method:"POST",headers:{Authorization:"Token ".concat(e)},body:t})}},{key:"getOverview",value:function(e,t){return fetch(i+"/api/orders/get_overview/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(t)})}},{key:"signinUser",value:function(e){return fetch(i+"/api-token-auth/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}},{key:"getAccountDetails",value:function(e,t){return fetch(i+"/api/accounts/"+t+"/",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)}})}},{key:"updateProfile",value:function(e,t,n){return fetch(i+"/api/accounts/update_profile/"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}},{key:"changePassword",value:function(e,t,n){return fetch(i+"/api/accounts/change_password"+t+"/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Token ".concat(e)},body:JSON.stringify(n)})}}]),e}()}}]);
//# sourceMappingURL=9.f6cb1498.chunk.js.map