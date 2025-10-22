'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid2 as Grid,
  Button,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PersonIcon from '@mui/icons-material/Person';
import { UserRole } from '@/types';

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      role: UserRole.TEACHER,
      icon: <SchoolIcon sx={{ fontSize: 80 }} />,
      title: '교사',
      description: '학교나 기관에서 학생을 가르치고 관리합니다',
      features: [
        '학생 일지 작성',
        '학생 성장 기록 관리',
        '보호자와 소통',
      ],
    },
    {
      role: UserRole.PARENT,
      icon: <FamilyRestroomIcon sx={{ fontSize: 80 }} />,
      title: '보호자',
      description: '자녀의 일상을 기록하고 학교와 소통합니다',
      features: [
        '가정 내 일지 작성',
        '학교 기록 확인',
        '교사와 소통',
      ],
    },
    {
      role: UserRole.INDIVIDUAL,
      icon: <PersonIcon sx={{ fontSize: 80 }} />,
      title: '당사자',
      description: '본인의 성장 기록과 포트폴리오를 확인합니다',
      features: [
        '나의 감정 타임라인',
        '역량 포트폴리오',
        '성장 기록 열람',
      ],
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/onboarding/profile?role=${selectedRole}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            역할 선택
          </Typography>
          <Typography variant="body1" color="text.secondary">
            꿈이자라는뜰에서 사용할 역할을 선택해주세요
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {roles.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.role}>
              <Card
                sx={{
                  height: '100%',
                  border: selectedRole === item.role ? 3 : 1,
                  borderColor: selectedRole === item.role ? 'primary.main' : 'grey.300',
                  transition: 'all 0.3s',
                }}
              >
                <CardActionArea
                  onClick={() => setSelectedRole(item.role)}
                  sx={{ height: '100%', p: 3 }}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2, color: 'primary.main' }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h5" align="center" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {item.features.map((feature, idx) => (
                        <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinue}
            disabled={!selectedRole}
          >
            계속하기
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
