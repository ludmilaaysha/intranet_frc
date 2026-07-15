import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChannelCarousel, { type CarouselItem } from './ChannelCarousel';
import * as React from 'react';
import { getFeatured } from '../../api/channels';

const API_URL = import.meta.env.VITE_API_URL;


export default function Hero() {
  const [heroItems, setHeroItems] = React.useState<CarouselItem[]>([]);

  React.useEffect(() => {
    getFeatured()
      .then((channels) => {
        setHeroItems(
          channels.map((channel) => ({
            id: channel.id,
            title: channel.name,
            subtitle: channel.subtitle ?? channel.description,
            image: channel.bannerUrl
              ? `${API_URL}${channel.bannerUrl}`
              : channel.thumbnailUrl
                ? `${API_URL}${channel.thumbnailUrl}`
                : '',
            isLive: channel.status === 'ONLINE',
            viewers: channel.viewers,
          })),
        );
      })
      .catch(console.error);
  }, []);

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
      {heroItems.length > 0 && (
        <ChannelCarousel items={heroItems} />
      )}
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