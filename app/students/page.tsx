'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid2 as Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getCurrentUser, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Student } from '@/types';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<(Student & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const q = query(
          collection(db, 'students'),
          where('guardianIds', 'array-contains', user.uid)
        );
        const snapshot = await getDocs(q);
        const studentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as (Student & { id: string })[];

        setStudents(studentsData);
      } catch (error) {
        console.error('학생 목록 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">학생 관리</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/students/create')}
          >
            학생 등록
          </Button>
        </Box>

        {students.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              등록된 학생이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              새로운 학생을 등록해보세요
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/students/create')}
            >
              학생 등록
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {students.map((student) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={student.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={student.photoURL}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      >
                        {student.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{student.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.affiliation}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      포트폴리오 완성도: {student.portfolioCompletionPct}%
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => router.push(`/students/${student.id}`)}
                    >
                      상세보기
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
