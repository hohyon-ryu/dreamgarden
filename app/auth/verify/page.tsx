'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { completeEmailLinkSignIn } from '@/lib/firebase';

function VerifyContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmailLink = async () => {
      try {
        const url = window.location.href;
        await completeEmailLinkSignIn(url);
        setSuccess(true);
        setLoading(false);

        // 2초 후 대시보드로 리다이렉트
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : '로그인 실패');
        setLoading(false);
      }
    };

    verifyEmailLink();
  }, [router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          {loading && (
            <>
              <CircularProgress size={80} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                로그인 처리 중...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                잠시만 기다려주세요
              </Typography>
            </>
          )}

          {success && !loading && (
            <>
              <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                로그인 성공!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                곧 대시보드로 이동합니다...
              </Typography>
            </>
          )}

          {error && !loading && (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                로그인 실패
              </Typography>
              <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={() => router.push('/auth/signin')}
              >
                다시 시도하기
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={80} />
          </Box>
        </Container>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
