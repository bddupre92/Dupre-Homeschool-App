(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{4562:function(e,r,n){Promise.resolve().then(n.bind(n,9817)),Promise.resolve().then(n.bind(n,9043)),Promise.resolve().then(n.bind(n,2720)),Promise.resolve().then(n.bind(n,2888))},9043:function(e,r,n){"use strict";n.r(r),n.d(r,{AuthProvider:function(){return AuthProvider},useAuth:function(){return useAuth}});var t=n(7437),u=n(2265),i=n(8153),a=n(994),o=n(9365),c=n(9584),s=n(2601);let l={apiKey:"AIzaSyBNDddgbmDgDjG4K-FuFjkM6FMCB9_zGLk",authDomain:"dupre-homeschool-app.firebaseapp.com",projectId:"dupre-homeschool-app",storageBucket:"dupre-homeschool-app.firebasestorage.app",messagingSenderId:"283384305539",appId:"1:283384305539:web:54981e950614530d5e08b6",measurementId:s.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID},h=(0,a.ZF)(l);(0,o.IH)(h);let d=(0,i.v0)(h);(0,c.cF)(h);let f=(0,u.createContext)({user:null,loading:!0,signOut:async()=>{}}),useAuth=()=>(0,u.useContext)(f),AuthProvider=e=>{let{children:r}=e,[n,a]=(0,u.useState)(null),[o,c]=(0,u.useState)(!0);(0,u.useEffect)(()=>{let e=(0,i.Aj)(d,e=>{a(e),c(!1)});return()=>e()},[]);let signOut=async()=>{try{await (0,i.w7)(d)}catch(e){console.error("Error signing out:",e)}};return(0,t.jsx)(f.Provider,{value:{user:n,loading:o,signOut},children:r})}},2720:function(e,r,n){"use strict";n.r(r);var t=n(7437);n(2265);var u=n(4740);function DefaultErrorFallback(e){let{error:r,resetErrorBoundary:n}=e;return(0,t.jsxs)("div",{role:"alert",className:"error-boundary-fallback",children:[(0,t.jsx)("h2",{children:"Something went wrong."}),(0,t.jsxs)("details",{children:[(0,t.jsx)("summary",{children:"Error details"}),(0,t.jsx)("pre",{children:r.message})]}),(0,t.jsx)("button",{onClick:n,className:"error-boundary-retry-button",children:"Try again"})]})}r.default=e=>{let{children:r,onError:n=(e,r)=>{console.error("Caught error:",e,r)},fallback:i}=e;return(0,t.jsx)(u.SV,{fallbackRender:e=>{let{error:r,resetErrorBoundary:n}=e;return i?(0,t.jsx)(t.Fragment,{children:i}):(0,t.jsx)(DefaultErrorFallback,{error:r,resetErrorBoundary:n})},onError:n,children:r})}},2888:function(e,r,n){"use strict";n.r(r),n.d(r,{CacheProvider:function(){return CacheProvider},clearCache:function(){return clearCache},invalidateQueries:function(){return invalidateQueries},prefetchQuery:function(){return prefetchQuery},useMutationCache:function(){return useMutationCache},useQueryCache:function(){return useQueryCache},useSWRCache:function(){return useSWRCache}});var t=n(7437),u=n(1617),i=n(9077);n(2265);let a=new i.QueryClient({defaultOptions:{queries:{refetchOnWindowFocus:!1,staleTime:3e5,cacheTime:36e5,retry:1}}});function CacheProvider(e){let{children:r}=e;return(0,t.jsx)(i.QueryClientProvider,{client:a,children:(0,t.jsx)(u.J$,{value:{fetcher:e=>fetch(e).then(e=>e.json()),revalidateOnFocus:!1,revalidateOnReconnect:!1,dedupingInterval:3e5},children:r})})}function useSWRCache(e,r){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},{useSWR:u}=n(9601);return u(e,r,{...t})}function useQueryCache(e,r){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},{useQuery:u}=n(9077);return u(e,r,{...t})}function useMutationCache(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{useMutation:t}=n(9077);return t(e,{...r})}function prefetchQuery(e,r){return a.prefetchQuery(e,r)}function invalidateQueries(e){return a.invalidateQueries(e)}function clearCache(){a.clear()}}},function(e){e.O(0,[109,912,551,971,472,744],function(){return e(e.s=4562)}),_N_E=e.O()}]);