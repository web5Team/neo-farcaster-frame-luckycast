import { useMutation } from '@tanstack/react-query'
import disposition from '../disposition'
import { client } from './client'
import { ApiResult, TRank, TReward } from './models'

// 定义一个类型key为string，value为any类型的对象
const fatchRank:{
  [key: string]:number
} = {}
export function useFarcasterRankMutation() {
  return useMutation({
    mutationKey: ['farcasterRank'],
    mutationFn: (body: { fid: string }) =>
      client<ApiResult<TRank[]>>('/index.php/api/farcaster/rank', {
        method: 'POST',
        body,
      }),
  })
}

export function useVerifyTeamcode() {
  return useMutation({
    mutationKey: ['checkCode'],
    mutationFn: (body: { team_code: string }) =>
      client<ApiResult<{ is_check: boolean }>>('/index.php/api/farcaster/checkCode', {
        method: 'POST',
        body,
      }),
  })
}

export function useSumbitDataMutation() {
  return useMutation({
    mutationKey: ['sumbit'],
    mutationFn: (body: {
      fid: string
      nickname: string
      email: string
      address: string
      team_code: string
    }) =>
      client<ApiResult<string[]>>('/index.php/api/farcaster/submitData', {
        method: 'POST',
        body,
      }),
  })
}

export function useGetRewardMutation() {
  return useMutation({
    mutationKey: ['getReward'],
    mutationFn: (body: { fid: string, address: string }) =>
      client<ApiResult<TReward>>('/index.php/api/farcaster/getReward', {
        method: 'POST',
        body,
      }),
  })
}


export function useReceiveMutation() {
  return useMutation({
    mutationKey: ['receive'],
    mutationFn: (body: { fid: string, address: string }) =>{
      const time = fatchRank['receive']
      if(time && Date.now() - new Date(time).getTime() < 1000 * 10){
        return Promise.reject('not allow ')
      }else fatchRank['receive'] = Date.now()
      return client<ApiResult<string>>('/index.php/api/farcaster/receive', {
        method: 'POST',
        body,
      })
    }
  })
}

export function useVerifyTranspondMutation(verifyUrl?: string) {
  return useMutation({
    mutationKey: ['verifyTranspond'],
    mutationFn: (query: { fid: string }) =>
      client<{ message: string }>(verifyUrl || disposition.first.verifyUrl, {
        method: 'POST',
        query,
      }),
  })
}
