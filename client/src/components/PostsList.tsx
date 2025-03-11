import { Box, Paper, Stack, Typography, useTheme } from '@mui/material'

import { formatDateDM } from '@/helpers'

interface Post {
  id: string
  text: string
  picture?: string
  date: string
}

const posts: Post[] = [
  {
    id: '1',
    text: 'Today is a good day',
    date: '2021-10-01T12:00:00Z',
  },
  {
    id: '2',
    text: 'Welcome to my blog',
    picture: 'https://picsum.photos/300',
    date: '2021-10-02T12:00:00Z',
  },
  {
    id: '3',
    text: 'Hello, world!',
    date: '2021-10-03T12:00:00Z',
  },
  {
    id: '4',
    text: 'This is a test post',
    picture: 'https://picsum.photos/400',
    date: '2021-10-04T12:00:00Z',
  },
]

export default function PostsList() {
  return (
    <Stack spacing={4}>
      <Typography variant='h4'>Posts</Typography>
      <Stack spacing={2}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
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
        {formatDateDM(post.date)}
      </Typography>
      {post.picture && (
        <Box
          component='img'
          src={post.picture}
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
