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
  Grid2 as Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TimelineIcon from '@mui/icons-material/Timeline';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
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
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              대시보드
            </Typography>
            <Typography variant="body2" color="text.secondary">
              안녕하세요, {user.displayName || user.email}님!
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
          >
            로그아웃
          </Button>
        </Box>

        {/* Onboarding Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>프로필 설정이 필요합니다.</strong> 역할을 선택하고 프로필을 완성해주세요.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => router.push('/onboarding/role')}
            sx={{ mt: 1 }}
          >
            프로필 설정하기
          </Button>
        </Alert>

        {/* Quick Actions */}
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          빠른 실행
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <AddIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  기록 작성
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  새로운 일지를 작성합니다
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => router.push('/records/create')}
                >
                  작성하기
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <TimelineIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  타임라인
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  기록을 시간순으로 확인합니다
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => router.push('/timeline')}
                >
                  보기
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  학생 관리
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  학생 정보를 관리합니다
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => router.push('/students')}
                >
                  관리하기
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <SettingsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  설정
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  프로필 및 환경 설정
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => router.push('/settings')}
                >
                  설정하기
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          최근 활동
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            아직 활동 내역이 없습니다.
            <br />
            첫 번째 기록을 작성해보세요!
          </Typography>
        </Paper>

        {/* User Info (Development) */}
        <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            개발자 정보 (Development Only)
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>User ID:</strong> {user.uid}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Display Name:</strong> {user.displayName || '미설정'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Email Verified:</strong> {user.emailVerified ? '✓' : '✗'}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
