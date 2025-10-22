'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { getCurrentUser, signOut, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = getCurrentUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setDisplayName(userDoc.data().displayName || '');
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const user = getCurrentUser();
      if (!user) throw new Error('로그인이 필요합니다');

      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        updatedAt: new Date(),
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            설정
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              저장되었습니다
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              프로필 정보
            </Typography>
            <TextField
              fullWidth
              label="이름"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
            >
              저장
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom color="error">
              계정 관리
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleSignOut}
            >
              로그아웃
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
