'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { UserRole } from '@/types';
import { getCurrentUser, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

function ProfileSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as UserRole;

  const [displayName, setDisplayName] = useState('');
  const [hoching, setHoching] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!role || !Object.values(UserRole).includes(role)) {
      router.push('/onboarding/role');
    }
  }, [role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('로그인이 필요합니다');
      }

      const userData: Record<string, unknown> = {
        userId: user.uid,
        role,
        email: user.email,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (role === UserRole.PARENT) {
        userData.hoching = hoching;
      } else if (role === UserRole.TEACHER) {
        userData.facilityId = facilityName;
        userData.managedStudentIds = [];
      } else if (role === UserRole.INDIVIDUAL) {
        userData.affiliation = affiliation;
      }

      await setDoc(doc(db, 'users', user.uid), userData);

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            프로필 설정
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {role === UserRole.TEACHER && '교사 프로필을 설정합니다'}
            {role === UserRole.PARENT && '보호자 프로필을 설정합니다'}
            {role === UserRole.INDIVIDUAL && '당사자 프로필을 설정합니다'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이름"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />

            {role === UserRole.PARENT && (
              <TextField
                fullWidth
                label="호칭"
                value={hoching}
                onChange={(e) => setHoching(e.target.value)}
                placeholder="예: 엄마, 아빠"
                required
                disabled={loading}
                sx={{ mb: 3 }}
                helperText="자녀와의 관계를 나타내는 호칭을 입력하세요"
              />
            )}

            {role === UserRole.TEACHER && (
              <TextField
                fullWidth
                label="소속 기관"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="예: 서울특수학교"
                required
                disabled={loading}
                sx={{ mb: 3 }}
                helperText="소속된 학교나 기관 이름을 입력하세요"
              />
            )}

            {role === UserRole.INDIVIDUAL && (
              <TextField
                fullWidth
                label="소속"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="예: 서울중, 3학년"
                required
                disabled={loading}
                sx={{ mb: 3 }}
                helperText="학교와 학년을 입력하세요"
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? '생성 중...' : '프로필 완성'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default function ProfileSetupPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <ProfileSetupContent />
    </Suspense>
  );
}
