import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} 꿈이자라는뜰. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <MuiLink href="/privacy" color="inherit" underline="hover">
            개인정보처리방침
          </MuiLink>
          {' | '}
          <MuiLink href="/terms" color="inherit" underline="hover">
            이용약관
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
}
