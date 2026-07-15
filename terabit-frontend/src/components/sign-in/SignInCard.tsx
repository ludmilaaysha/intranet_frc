import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { SitemarkIcon } from '../CustomIcons';
import { useAuth } from '../../context/AuthContext';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%', padding: theme.spacing(4), gap: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { width: '450px' },
}));

export default function SignInCard() {
  const { login } = useAuth();
  return <Card variant="outlined">
    <Box sx={{ display: { xs: 'flex', md: 'none' } }}><SitemarkIcon /></Box>
    <Typography component="h1" variant="h4" sx={{ width: '100%' }}>Fazer login</Typography>
    <Button type="button" fullWidth variant="contained" onClick={login}>Entrar com a conta corporativa</Button>
  </Card>;
}
