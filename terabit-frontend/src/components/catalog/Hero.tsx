import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ChannelCarousel, { type CarouselItem } from './ChannelCarousel';
import espnBanner from '@/assets/img/banners/espn.png';
import atlFortBanner from '@/assets/img/banners/atl-fortal.png';
import magnumBanner from '@/assets/img/banners/magnum.png';
import paradiseBanner from '@/assets/img/banners/paradise.png';

const heroItems: CarouselItem[] = [
  { id: 1, title: 'ESPN 2026', image: espnBanner, subtitle: 'Copa do Mundo 2026 ao vivo' },
  { id: 2, title: 'Atlético Goianiense x Fortaleza', image: atlFortBanner },
  { id: 3, title: 'Magnum', image: magnumBanner },
  { id: 4, title: 'Paradise', image: paradiseBanner },
];

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        overflow: 'hidden',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        id="home"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <ChannelCarousel items={heroItems} />
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Explore&nbsp;nossos&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              canais
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Canais ao vivo em multicast, adaptados automaticamente à qualidade da sua rede.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}