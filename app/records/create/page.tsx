'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getCurrentUser, db, storage } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SchoolContext } from '@/types';
import { EMOTION_CARDS } from '@/lib/constants';

export default function CreateRecordPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [schoolContext, setSchoolContext] = useState<SchoolContext | ''>('');
  const [narrativeText, setNarrativeText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [checklistItems, setChecklistItems] = useState<Array<{ id: string; label: string; checked: boolean }>>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const user = getCurrentUser();
        if (!user) return;

        const q = query(
          collection(db, 'students'),
          where('guardianIds', 'array-contains', user.uid)
        );
        const snapshot = await getDocs(q);
        const studentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error('학생 목록 로드 실패:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([
        ...checklistItems,
        { id: Date.now().toString(), label: newChecklistItem, checked: false },
      ]);
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (mediaFiles.length + newFiles.length > 20) {
        setError('미디어 파일은 최대 20개까지 첨부할 수 있습니다');
        return;
      }
      setMediaFiles([...mediaFiles, ...newFiles]);
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

      if (!selectedStudent || !schoolContext) {
        throw new Error('필수 항목을 입력해주세요');
      }

      const mediaUrls: string[] = [];
      for (const file of mediaFiles) {
        const storageRef = ref(storage, `records/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        mediaUrls.push(url);
      }

      const recordData = {
        studentId: selectedStudent,
        authorId: user.uid,
        authorRole: 'Teacher',
        schoolContext,
        narrativeTextRaw: narrativeText,
        narrativeTextShared: narrativeText,
        aiNeutralized: false,
        emotionCardId: selectedEmotion || 0,
        checklistItems,
        mediaUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'records'), recordData);

      router.push('/timeline');
    } catch (err) {
      setError(err instanceof Error ? err.message : '기록 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            기록 작성
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            학생의 일상 기록을 작성합니다
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel>학생 선택</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={loading}
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel>시간대</InputLabel>
              <Select
                value={schoolContext}
                onChange={(e) => setSchoolContext(e.target.value as SchoolContext)}
                disabled={loading}
              >
                <MenuItem value={SchoolContext.PRE}>등교 전</MenuItem>
                <MenuItem value={SchoolContext.DURING}>학교/기관 중</MenuItem>
                <MenuItem value={SchoolContext.POST}>귀가 후</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="기록 내용"
              value={narrativeText}
              onChange={(e) => setNarrativeText(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
              helperText="오늘 있었던 일을 자유롭게 작성해주세요"
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                오늘의 감정
              </Typography>
              <Grid container spacing={1}>
                {EMOTION_CARDS.map((emotion) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={emotion.id}>
                    <Chip
                      icon={<span style={{ fontSize: 24 }}>{emotion.icon}</span>}
                      label={emotion.label}
                      onClick={() => setSelectedEmotion(emotion.id)}
                      color={selectedEmotion === emotion.id ? 'primary' : 'default'}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                체크리스트
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="항목 추가"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddChecklistItem}
                  startIcon={<AddIcon />}
                >
                  추가
                </Button>
              </Box>
              {checklistItems.length > 0 && (
                <List dense>
                  {checklistItems.map((item) => (
                    <ListItem key={item.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.checked}
                            onChange={() => handleToggleChecklistItem(item.id)}
                          />
                        }
                        label={item.label}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteChecklistItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                사진/동영상 첨부 (최대 20개)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                disabled={loading || mediaFiles.length >= 20}
              >
                파일 선택
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                />
              </Button>
              {mediaFiles.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {mediaFiles.length}개 파일 선택됨
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
                {loading ? '저장 중...' : '기록 저장'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
