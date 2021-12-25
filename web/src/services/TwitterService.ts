import { getApiUrl } from '../utils'
import { Logger } from './Logger'

export type TwitterUser = {
  id: number
  name: string
  screen_name: string
  location: string
  description: string
  followers_count: number
  friends_count: number
  profile_image_url: string
  profile_image_url_https: string
}

export type TwitterPost = {
  created_at: string
  id: number
  text: string
  truncated: boolean
  in_reply_to_status_id: number
  in_reply_to_user_id: number
  in_reply_to_screen_name: string
  user: TwitterUser
  is_quote_status: boolean
  retweet_count: number
  favorite_count: number
}

class TwitterService {
  private readonly logger = new Logger('Twitter')

  public async getPostById(postId: string) {
    this.logger.log(`Get post by id [postId=${postId}]`)

    const res = await fetch(`${getApiUrl()}/twitter/post/${postId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(await res.text())
    }

    const body = (await res.json()) as TwitterPost
    return body
  }
}

export default new TwitterService()
