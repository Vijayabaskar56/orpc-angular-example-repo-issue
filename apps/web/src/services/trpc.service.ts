// import { Injectable } from "@angular/core";
// import { createTRPCClient, httpBatchLink } from "@trpc/client";
// import type { AppRouter } from "../../../server/src/routers/index";



// @Injectable({
//  providedIn: "root",
// })
// export class trpcService {
//  public proxy = createTRPCClient<AppRouter>({
//   links: [
//    httpBatchLink({
//     url: "http://localhost:3000/trpc",
//     fetch: (url, options) => {
//      return fetch(url, {
//       ...options,
//       credentials: "include",
//      });
//     },
//    }),
//   ],
//  });

// }
