import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import Box from '@mui/material/Box';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { watchChannel } from './../api/channels';

export interface MediaCardProps {
  isLive: boolean;
  viewers: number;
  name: string;
  description: string;
  imageUrl: string | null;
  id: number;
}

export default function MediaCard({
  id,
  isLive,
  viewers,
  name,
  description,
  imageUrl,
}: MediaCardProps) {
  const handleWatch = () => {
    watchChannel(id);
  };

  return (
    <Card
      sx={(theme) => ({
        maxWidth: 345,
        outline: '3px solid',
        outlineColor: 'transparent',
        transition:
          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)',
          outlineColor: 'hsla(200, 100%, 55%, 0.60)',
          boxShadow: '0 0 16px 6px hsla(220, 25%, 80%, 0.35)',
          ...theme.applyStyles('dark', {
            outlineColor: 'hsla(200, 100%, 65%, 0.50)',
            boxShadow: '0 0 24px 10px hsla(210, 100%, 25%, 0.35)',
          }),
        },
      })}
    >
      <CardMedia
        sx={{ height: 140 }}
        image={imageUrl || '/images/placeholder.jpg'}
        title={name}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
        <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
          <Chip
            label={isLive ? 'Ao vivo' : 'Fora do ar'}
            icon={<CircleIcon />}
            size="small"
            color={isLive ? 'error' : 'default'}
          />
          {isLive ? (
            <Typography variant="body2" sx={{ size: 12, color: 'rgba(255, 255, 255, 0.5)' }}>
              {viewers} assistindo
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Typography noWrap gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ marginTop: 2 }}>
        {isLive ? (
          <Button
            variant="contained"
            size="small"
            sx={{ width: '100%' }}
            startIcon={<PlayArrowRoundedIcon />}
            onClick={handleWatch}
          >
            Assistir
          </Button>
        ) : null}
        {/* <Button variant="outlined" size="small" sx={{ width: '100%' }} startIcon={<InfoOutlinedIcon />}>
          Detalhes
        </Button> */}
      </CardActions>
    </Card>
  );
}