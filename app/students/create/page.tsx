'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { getCurrentUser, db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CreateStudentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('로그인이 필요합니다');
      }

      let photoURL = '';
      if (photoFile) {
        const storageRef = ref(storage, `students/${Date.now()}_${photoFile.name}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      const studentData = {
        name,
        affiliation,
        photoURL,
        guardianIds: [user.uid],
        portfolioCompletionPct: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'students'), studentData);

      router.push('/students');
    } catch (err) {
      setError(err instanceof Error ? err.message : '학생 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            학생 등록
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            새로운 학생 정보를 등록합니다
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />

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

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                프로필 사진
              </Typography>
              <Button
                variant="outlined"
                component="label"
                disabled={loading}
              >
                사진 선택
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </Button>
              {photoFile && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  선택됨: {photoFile.name}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={loading}
                fullWidth
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? '등록 중...' : '등록하기'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
