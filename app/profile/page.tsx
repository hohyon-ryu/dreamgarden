'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Grid2 as Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { getCurrentUser, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name: string;
    portfolioCompletionPct: number;
    competencies: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({
            name: userDoc.data().displayName || '사용자',
            portfolioCompletionPct: 45,
            competencies: ['정리정돈', '의사소통', '협동력'],
          });
        }
      } catch (error) {
        console.error('프로필 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

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

  if (!userData) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          마이페이지
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {userData.name}님의 성장 기록
        </Typography>

        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            포트폴리오 완성도
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <LinearProgress
                variant="determinate"
                value={userData.portfolioCompletionPct}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h6" color="primary">
              {userData.portfolioCompletionPct}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            조금만 더 기록을 쌓으면 포트폴리오가 완성됩니다!
          </Typography>
        </Paper>

        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            나의 핵심 역량
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {userData.competencies.map((competency, idx) => (
              <Chip key={idx} label={competency} color="primary" />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary">
            AI가 분석한 당신의 강점입니다
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  감정 타임라인
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  최근 7일간의 감정 변화
                </Typography>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    데이터 준비 중...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  추천 직업
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  당신의 역량에 맞는 직업
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">• 사무 보조</Typography>
                  <Typography variant="body2">• 수공예 작가</Typography>
                  <Typography variant="body2">• 환경 미화원</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
