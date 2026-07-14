import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MediaCard from '../MediaCard';
import { getMany as getChannels, type Channel } from '../../api/channels';

export default function Channels() {
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  console.log(channels);
  React.useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    getChannels({
      paginationModel: { page: 0, pageSize: 100 },
      sortModel: [{ field: 'viewers', sort: 'desc' }],
      filterModel: { items: [] },
    })
      .then((result) => {
        if (active) {
          setChannels(result.items);
        }
      })
      .catch((fetchError) => {
        if (active) {
          setError(fetchError as Error);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Container id="channels" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Canais
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}
        >
          Assista aos canais multicast do grupo Terabit Solution.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column' },
          gap: 2,
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error.message}
          </Alert>
        ) : (
          <Grid container spacing={2} sx={{ p: 0 }}>
            {channels.map((channel) => (
            <Grid key={channel.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <MediaCard
                id={channel.id}
                isLive={channel.status === 'ONLINE'}
                viewers={channel.viewers}
                name={channel.name}
                description={channel.description}
                imageUrl={`${import.meta.env.VITE_API_URL}${channel.thumbnailUrl}`}
              />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}