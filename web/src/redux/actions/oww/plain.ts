import { AC } from '../../utils'
import { OWWActionPayload, OWWActionType } from './types'

export const changePostURL: AC<
  OWWActionType.changePostURL,
  OWWActionPayload[OWWActionType.changePostURL]
> = ({ postUrl }) => ({
  type: OWWActionType.changePostURL,
  payload: {
    postUrl,
  },
})

export const clearInput: AC<
  OWWActionType.clearInput,
  OWWActionPayload[OWWActionType.clearInput]
> = () => ({
  type: OWWActionType.clearInput,
  payload: undefined,
})

export const getTokenIdsStart: AC<
  OWWActionType.getTokenIdsStart,
  OWWActionPayload[OWWActionType.getTokenIdsStart]
> = () => ({
  type: OWWActionType.getTokenIdsStart,
  payload: undefined,
})
export const getTokenIdsSuccess: AC<
  OWWActionType.getTokenIdsSuccess,
  OWWActionPayload[OWWActionType.getTokenIdsSuccess]
> = ({ tokenIds }) => ({
  type: OWWActionType.getTokenIdsSuccess,
  payload: { tokenIds },
})
export const getTokenIdsFailure: AC<
  OWWActionType.getTokenIdsFailure,
  OWWActionPayload[OWWActionType.getTokenIdsFailure]
> = ({ error }) => ({
  type: OWWActionType.getTokenIdsFailure,
  payload: { error },
})
export const getPostPriceStart: AC<
  OWWActionType.getPostPriceStart,
  OWWActionPayload[OWWActionType.getPostPriceStart]
> = () => ({
  type: OWWActionType.getPostPriceStart,
  payload: undefined,
})
export const getPostPriceSuccess: AC<
  OWWActionType.getPostPriceSuccess,
  OWWActionPayload[OWWActionType.getPostPriceSuccess]
> = ({ price }) => ({
  type: OWWActionType.getPostPriceSuccess,
  payload: { price },
})
export const getPostPriceFailure: AC<
  OWWActionType.getPostPriceFailure,
  OWWActionPayload[OWWActionType.getPostPriceFailure]
> = ({ error }) => ({
  type: OWWActionType.getPostPriceFailure,
  payload: { error },
})
export const mintPostStart: AC<
  OWWActionType.mintPostStart,
  OWWActionPayload[OWWActionType.mintPostStart]
> = ({ snName, postId }) => ({
  type: OWWActionType.mintPostStart,
  payload: { snName, postId },
})
export const mintPostSuccess: AC<
  OWWActionType.mintPostSuccess,
  OWWActionPayload[OWWActionType.mintPostSuccess]
> = ({ tokenId }) => ({
  type: OWWActionType.mintPostSuccess,
  payload: { tokenId },
})
export const mintPostFailure: AC<
  OWWActionType.mintPostFailure,
  OWWActionPayload[OWWActionType.mintPostFailure]
> = ({ error }) => ({
  type: OWWActionType.mintPostFailure,
  payload: { error },
})
