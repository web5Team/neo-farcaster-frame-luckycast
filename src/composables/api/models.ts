export interface ApiResult<D = unknown> {
  data: D
  code: 0 | 1

  msg: 'success' | (string & {})
}

// export interface ApiListResult<I>
//   extends ApiResult<{
//     list: I[]
//     total: number
//   }> {}

export interface TRank {
  name: string
  number: number
  team_code: string
}

export interface TReward {
  id: number
  fid: string
  money: string
  unit: string
  status: number
  balance:string
  balance_unit:string
}
