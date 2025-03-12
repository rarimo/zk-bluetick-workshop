import { Box, CircularProgress, Paper, Stack, Typography, useTheme } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { ErrorHandler, formatTimeFromNow } from '@/helpers'

interface Post {
  _id: string
  text: string
  picture?: string
  date: string
}

export default function PostsList({ refetchFlag }: { refetchFlag: boolean }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts')
        const data = response.data

        const fetchedPosts: Post[] = data.map((post: Post) => ({
          _id: post._id,
          text: post.text,
          picture: post?.picture,
          date: post.date,
        }))

        setPosts(fetchedPosts)
      } catch (error) {
        ErrorHandler.process(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [refetchFlag])

  if (loading) {
    return (
      <Stack alignItems='center' justifyContent='center'>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Stack spacing={4}>
      <Typography variant='h4'>Posts</Typography>
      <Stack spacing={2}>
        {posts?.toReversed().map(post => <PostCard key={post._id} post={post} />)}
      </Stack>
    </Stack>
  )
}

function PostCard({ post }: { post: Post }) {
  const { palette } = useTheme()

  return (
    <Paper component={Stack} spacing={1}>
      <Typography variant='subtitle2'>{post.text}</Typography>
      <Typography variant='body3' color={palette.text.secondary}>
        {formatTimeFromNow(post.date)}
      </Typography>
      {post?.picture && (
        <Box
          component='img'
          src={`http://localhost:5000/${post.picture}`}
          alt='Post picture'
          sx={{
            width: '100%',
            height: 200,
            borderRadius: 4,
            objectFit: 'cover',
            mt: 2,
          }}
        />
      )}
    </Paper>
  )
}
