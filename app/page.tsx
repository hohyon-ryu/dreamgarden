'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" color="primary">
          꿈이자라는뜰
        </Typography>

        <Typography variant="h5" component="h2" color="text.secondary">
          AI 통합 발달장애인 모바일 플랫폼
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          발달장애인 당사자와 관련 이해관계자(교사, 보호자) 간의 기록을 신뢰 기반으로 공유하고,
          개인의 성장 여정과 프로필을 체계적으로 축적하는 플랫폼입니다.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            onClick={() => router.push('/auth/signin')}
            variant="contained"
            size="large"
          >
            로그인
          </Button>

          <Button
            onClick={() => router.push('/about')}
            variant="outlined"
            size="large"
          >
            자세히 보기
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
