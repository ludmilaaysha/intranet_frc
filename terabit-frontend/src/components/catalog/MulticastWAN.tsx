import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export interface MulticastWANProps {
  image: string;
  title: string;
  subtitle?: string;
  logo?: string;
  isLive: boolean;
  viewers: number;
}

export default function MulticastWAN({
  image,
  title,
  subtitle,
  logo,
  isLive,
  viewers,
}: MulticastWANProps) {
  return (
    <Container id="wan" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Multicast WAN
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Caso você esteja na rede WAN (192.168.0.0/24), você só poderá assistir a este canal no momento.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row', alignItems: 'center' },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: '100%', md: '60%' },
            // height: 500,
            aspectRatio: '16/9',
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${image})`,
              }}
            />
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
            <Chip
              label={isLive ? 'Ao vivo' : 'Fora do ar'}
              icon={<CircleIcon />}
              size="small"
              color={isLive ? 'error' : 'default'}
            />
            {isLive ? (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {viewers} assistindo
              </Typography>
            ) : null }
          </Box>
          {logo ? (
            <Box
              component="img"
              src={logo}
              alt={title}
              sx={{ height: { xs: 28, sm: 36 }, mb: 1, width: 'auto' }}
            />
          ) : (
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem' }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
              {subtitle}
            </Typography>
          )}
          <CardActions sx={{ marginTop: 2, px: 0 }}>
            {isLive ? (
              <Button variant="contained" size="small" startIcon={<PlayArrowRoundedIcon />}>
                Assistir
              </Button>
            ) : null}
            <Button variant="outlined" startIcon={<InfoOutlinedIcon />} size="small">
              Detalhes
            </Button>
          </CardActions>
        </Box>
      </Box>
    </Container>
  );
}