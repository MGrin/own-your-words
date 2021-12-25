import type { Reducer } from 'react'
import { OWWAction, OWWActionType } from '../actions/oww/types'

export type OWWInputState = {
  postUrl: string
  isUrlValid: boolean
  postId: string
}

export type OWWState = {
  price: string
  tokenIds: number[]

  loading?: boolean
  error?: Error
} & OWWInputState

const getPostIdFromUrl = (urlStr: string) => {
  try {
    const url = new URL(urlStr)
    switch (url.host) {
      case 'twitter.com': {
        const re = /(https:\/\/)?twitter\.com\/([^/]+)\/status\/(\d+)/
        const exec = re.exec(urlStr)
        if (!exec) {
          return undefined
        }
        const postId = exec[3]
        return postId
      }
      default: {
        return undefined
      }
    }
  } catch (err) {
    return undefined
  }
}

const initialOWWInputState: OWWInputState = {
  postUrl: '',
  isUrlValid: false,
  postId: '',
}

const initialState: OWWState = {
  price: '0.05',
  tokenIds: [],
  ...initialOWWInputState,
}

const reducer: Reducer<OWWState, OWWAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case OWWActionType.changePostURL: {
      const { postUrl } = action.payload
      const postId = getPostIdFromUrl(postUrl) || ''
      return {
        ...state,
        postUrl,
        postId,
        isUrlValid: !!postId,

        error: undefined,
      }
    }

    case OWWActionType.clearInput: {
      return {
        ...state,
        ...initialOWWInputState,
        loading: false,
        error: undefined,
      }
    }

    case OWWActionType.getTokenIdsStart: {
      return {
        ...state,
        loading: true,
        error: undefined,
      }
    }
    case OWWActionType.getTokenIdsSuccess: {
      const { tokenIds } = action.payload
      return {
        ...state,
        loading: false,
        error: undefined,
        tokenIds,
      }
    }
    case OWWActionType.getTokenIdsFailure: {
      const { error } = action.payload
      return {
        ...state,
        loading: false,
        error,
      }
    }
    case OWWActionType.getPostPriceStart: {
      return {
        ...state,
        loading: true,
      }
    }
    case OWWActionType.getPostPriceSuccess: {
      const { price } = action.payload
      return {
        ...state,
        loading: false,
        price,
      }
    }
    case OWWActionType.getPostPriceFailure: {
      const { error } = action.payload
      return {
        ...state,
        loading: false,
        error,
      }
    }
    case OWWActionType.mintPostStart: {
      return {
        ...state,
        loading: true,
        error: undefined,
      }
    }
    case OWWActionType.mintPostSuccess: {
      const { tokenId } = action.payload
      return {
        ...state,
        loading: false,
        error: undefined,
        tokenIds: [...state.tokenIds, Number(tokenId)],
      }
    }
    case OWWActionType.mintPostFailure: {
      const { error } = action.payload
      return {
        ...state,
        loading: false,
        error,
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
