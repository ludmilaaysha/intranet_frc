import { useEffect, useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CardActions from '@mui/material/CardActions';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

export interface CarouselItem {
  id: number | string;
  title: string;
  image: string;
  subtitle?: string;
  logo?: string;
  isLive: boolean;
  viewers: number;
}

interface ChannelCarouselProps {
  title?: string;
  items: CarouselItem[];
  autoPlayInterval?: number;
}

const SLIDE_WIDTH_PERCENT = 100;
const STEP_PERCENT = 102;

const Stage = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 260,
  // overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    height: 380,
  },
  [theme.breakpoints.up('md')]: {
    height: 460,
  },
}));

interface SlideBoxProps {
  diff: number;
}

const SlideBox = styled('div', {
  shouldForwardProp: (prop) => prop !== 'diff',
})<SlideBoxProps>(({ theme, diff }) => {
  const isCenter = diff === 0;
  const isVisible = Math.abs(diff) <= 1;
  const scale = isCenter ? 1 : 1;
  const opacity = isCenter ? 1 : isVisible ? 0.1 : 0;

  return {
    position: 'absolute',
    top: '50%',
    left: `${50 + diff * STEP_PERCENT}%`,
    width: `${SLIDE_WIDTH_PERCENT}%`,
    height: '100%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    transition:
      'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
    opacity,
    zIndex: 10 - Math.abs(diff),
    pointerEvents: isCenter ? 'auto' : 'none',
    borderRadius: 16,
    outline: '6px solid',
    outlineColor: 'hsla(220, 25%, 80%, 0.2)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.grey[200],
    boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    ...theme.applyStyles('dark', {
      boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
      outlineColor: 'hsla(220, 20%, 42%, 0.1)',
      borderColor: (theme.vars || theme).palette.grey[700],
    }),
  };
});

const Overlay = styled('div')({
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 70%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '6%',
  paddingRight: '44%',
});

const NavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 20,
  backgroundColor: 'rgba(20, 20, 20, 0.5)',
  color: '#fff',
  '&:hover': { backgroundColor: 'rgba(20, 20, 20, 0.8)' },
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}));

const Dots = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: 6,
  marginTop: 16,
});

interface DotProps {
  active: boolean;
}

const Dot = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<DotProps>(({ active }) => ({
  width: active ? 18 : 6,
  height: 6,
  borderRadius: 3,
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  backgroundColor: active ? '#fff' : 'rgba(128,128,128,0.5)',
  transition: 'width 0.3s ease, background-color 0.3s ease',
}));

export default function ChannelCarousel({
  title,
  items,
  autoPlayInterval = 6000,
}: ChannelCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      const len = items.length;
      setIndex(((i % len) + len) % len);
    },
    [items.length],
  );

  const handlePrev = () => goTo(index - 1);
  const handleNext = () => goTo(index + 1);

  useEffect(() => {
    if (!autoPlayInterval || isHovering || items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlayInterval, isHovering, items.length]);

  if (!items.length) return null;

  const len = items.length;

  return (
    <Box sx={{ mb: 6, width: '100%' }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
      )}

      <Stage
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {items.map((item, i) => {
          let diff = i - index;
          if (diff > len / 2) diff -= len;
          if (diff < -len / 2) diff += len;

          return (
            <SlideBox
              key={item.id}
              diff={diff}
              sx={(theme) => ({
                outline: '3px solid',
                outlineColor: 'transparent',
                cursor: 'pointer',
                '&:hover': {
                  outlineColor: 'hsla(200, 100%, 55%, 0.60)',
                  boxShadow: '0 0 16px 6px hsla(220, 25%, 80%, 0.35)',
                  ...theme.applyStyles('dark', {
                    outlineColor: 'hsla(200, 100%, 65%, 0.50)',
                    boxShadow: '0 0 24px 10px hsla(210, 100%, 25%, 0.35)',
                  }),
                },
              })}
              style={{ backgroundImage: `url(${item.image})` 
            }}
            >
              <Overlay>
                <Box sx={{ display: 'flex', mb: 1, gap: 1}}>
                  <Chip
                    label={item.isLive ? 'Ao vivo' : 'Fora do ar'}
                    icon={<CircleIcon />}
                    size="small"
                    color={item.isLive ? 'error' : 'default'}
                  />
                  {item.isLive ? (
                    <Typography variant="body2" sx={{ size: 12, color: 'rgba(255, 255, 255, 0.5)' }}>
                      {item.viewers} assistindo
                    </Typography>
                  ) : null}
                </Box>
                {item.logo ? (
                  <Box
                    component="img"
                    src={item.logo}
                    alt={item.title}
                    sx={{ height: { xs: 28, sm: 36 }, mb: 1, width: 'auto' }}
                  />
                ) : (
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 700, mb: 0.5, fontSize: '3rem', lineHeight: 1.15 }}
                  >
                    {item.title}
                  </Typography>
                )}
                {item.subtitle && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 360 }}
                  >
                    {item.subtitle}
                  </Typography>
                )}
                <CardActions sx={{marginTop: 2}} >
                  {item.isLive ? <Button variant='contained' size="small" startIcon={<PlayArrowRoundedIcon /> } >Assistir</Button> : null}
                  {/* <Button variant='outlined' startIcon={<InfoOutlinedIcon />} size="small">Detalhes</Button> */}
                </CardActions>
              </Overlay>
            </SlideBox>
          );
        })}

        <NavButton onClick={handlePrev} aria-label="Anterior" sx={{ left: -16 }}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </NavButton>
        <NavButton onClick={handleNext} aria-label="Próximo" sx={{ right: -16 }}>
          <ArrowForwardIosRoundedIcon fontSize="small" />
        </NavButton>
      </Stage>

      <Dots>
        {items.map((item, i) => (
          <Dot
            key={item.id}
            active={i === index}
            onClick={() => goTo(i)}
            aria-label={`Ir para o slide ${i + 1}`}
          />
        ))}
      </Dots>
    </Box>
  );
}