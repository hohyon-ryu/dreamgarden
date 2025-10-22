'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { getCurrentUser, signOut } from '@/lib/firebase';
import { User } from 'firebase/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth/signin');
    } else {
      setUser(currentUser);
    }
    setLoading(false);
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            대시보드
          </Typography>

          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              <strong>이메일:</strong> {user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>이름:</strong> {user.displayName || '미설정'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>사용자 ID:</strong> {user.uid}
            </Typography>
          </Box>

          <Button variant="outlined" onClick={handleSignOut}>
            로그아웃
          </Button>
        </Paper>

        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            환영합니다! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary">
            꿈이자라는뜰 플랫폼에 오신 것을 환영합니다.
            <br />
            현재 대시보드 개발이 진행 중입니다.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
