import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import type { Channel } from './../data/channels';

export default function MediaCard({ channel }: { channel: Channel }) {
  const transmitting = channel.status === 'ONLINE';

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={channel.thumbnailUrl ?? '/assets/img/banners/placeholder.jpg'}
        title={channel.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {channel.name}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1 }}>
          <Chip
            label={transmitting ? 'Ao vivo' : 'Fora do ar'}
            icon={<CircleIcon />}
            size="small"
            color={transmitting ? 'error' : 'default'}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {transmitting ? `${channel.viewers} espectadores` : null}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {channel.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Assistir</Button>
        <Button size="small">Detalhes</Button>
      </CardActions>
    </Card>
  );
}