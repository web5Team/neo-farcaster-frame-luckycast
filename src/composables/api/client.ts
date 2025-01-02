// import { retrieveLaunchParams } from '@telegram-apps/sdk-vue';
import type { ApiResult } from './models'
import { ofetch } from 'ofetch'
// import { mainStore } from '@/store'
// const { initDataRaw } = retrieveLaunchParams();
const baseUrl = 'https://neox.morecoin.top'
export const client = ofetch.create({
  baseURL:baseUrl,
  headers:{
    // Authorization:initDataRaw||'',
    server:'true',
  },
  async onResponse(context) {
    if(context.response.status === 500){
      // const store = mainStore()
      // if(store) store.tipMessage = "Server error"
    }
    if (context.response.status !== 200)
      return
    const result: ApiResult = context.response._data
    if (result.code !== 1) {
      // throw new Error(result.msg)
      // context.response = new Response(JSON.stringify(result), {
      //   headers: context.response.headers,
      //   status: 400,
      //   statusText: encodeURIComponent(result.msg),
      // })
      context.error = new Error(result.msg)
    }
  },
  async onResponseError(context) {
    const url = typeof context.request === 'string' ? new URL(baseUrl+context.request) : new URL(baseUrl+context.request.url)
    console.warn('❌ On Response Error:', {
      url: url.pathname,
      options: context.options,
      status: context.response.status,
      body: context.response._data ?? await context.response.text(),
      response: context.response,
      request: context.request,
    })
    if (context.error)
      throw context.error
    throw new Error(context.response.statusText)
  },
  onRequest(context) {
    context.options.headers ??= new Headers()
    context.options.headers.append('Authorization', sessionStorage.getItem('car-token') ?? '')

    console.info('🚀 On Request:', {
      url: typeof context.request === 'string' ? context.request : context.request.url,
      headers: context.options.headers,
      body: context.options.body,
      query: context.options.query,
    })
  },
})
