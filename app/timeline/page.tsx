'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { getCurrentUser, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Record, SchoolContext } from '@/types';
import { EMOTION_CARDS } from '@/lib/constants';

export default function TimelinePage() {
  const router = useRouter();
  const [records, setRecords] = useState<(Record & { id: string; studentName: string })[]>([]);
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        const studentsQuery = query(
          collection(db, 'students'),
          where('guardianIds', 'array-contains', user.uid)
        );
        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setStudents(studentsData);

        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0].id);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchRecords = async () => {
      try {
        const recordsQuery = query(
          collection(db, 'records'),
          where('studentId', '==', selectedStudent),
          orderBy('createdAt', 'desc')
        );
        const recordsSnapshot = await getDocs(recordsQuery);
        const recordsData = recordsSnapshot.docs.map(doc => {
          const data = doc.data();
          const student = students.find(s => s.id === data.studentId);
          return {
            id: doc.id,
            ...data,
            studentName: student?.name || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Record & { id: string; studentName: string };
        });
        setRecords(recordsData);
      } catch (error) {
        console.error('기록 로드 실패:', error);
      }
    };

    fetchRecords();
  }, [selectedStudent, students]);

  const getContextColor = (context: SchoolContext) => {
    switch (context) {
      case SchoolContext.PRE:
        return 'primary';
      case SchoolContext.DURING:
        return 'success';
      case SchoolContext.POST:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getContextLabel = (context: SchoolContext) => {
    switch (context) {
      case SchoolContext.PRE:
        return '등교 전';
      case SchoolContext.DURING:
        return '학교/기관 중';
      case SchoolContext.POST:
        return '귀가 후';
      default:
        return '';
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

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">타임라인</Typography>
          {students.length > 0 && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>학생 선택</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {records.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              아직 기록이 없습니다
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {records.map((record) => {
              const emotion = EMOTION_CARDS.find(e => e.id === record.emotionCardId);
              return (
                <Card key={record.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={getContextLabel(record.schoolContext)}
                          color={getContextColor(record.schoolContext)}
                          size="small"
                        />
                        {emotion && (
                          <Chip
                            icon={<span>{emotion.icon}</span>}
                            label={emotion.label}
                            size="small"
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {record.createdAt.toLocaleDateString('ko-KR')} {record.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {record.narrativeTextShared}
                    </Typography>

                    {record.checklistItems && record.checklistItems.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        {record.checklistItems.map((item) => (
                          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {item.checked ? '✅' : '⬜'} {item.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {record.mediaUrls && record.mediaUrls.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {record.mediaUrls.slice(0, 3).map((url, idx) => (
                          <Avatar
                            key={idx}
                            src={url}
                            variant="rounded"
                            sx={{ width: 80, height: 80 }}
                          />
                        ))}
                        {record.mediaUrls.length > 3 && (
                          <Avatar
                            variant="rounded"
                            sx={{ width: 80, height: 80, bgcolor: 'grey.300' }}
                          >
                            +{record.mediaUrls.length - 3}
                          </Avatar>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>
    </Container>
  );
}
