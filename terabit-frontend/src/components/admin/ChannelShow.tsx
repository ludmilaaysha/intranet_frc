import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  deleteOne as deleteChannel,
  getOne as getChannel,
  type Channel,
} from '../../data/channels';
import PageContainer from './PageContainer';

export default function ChannelShow() {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [channel, setChannel] = React.useState<Channel | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getChannel(Number(channelId));

      setChannel(showData);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [channelId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChannelEdit = React.useCallback(() => {
    navigate(`/admin/channels/${channelId}/edit`);
  }, [navigate, channelId]);

  const handleChannelDelete = React.useCallback(async () => {
    if (!channel) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `Deseja excluir o canal ${channel.name}?`,
      {
        title: `Excluir canal?`,
        severity: 'error',
        okText: 'Excluir',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteChannel(Number(channelId));

        navigate('/admin/channels');

        notifications.show('Canal excluído com sucesso.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `Falha ao excluir canal. Motivo: ${(deleteError as Error).message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [channel, dialogs, channelId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/admin/channels');
  }, [navigate]);

  const renderShow = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return channel ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Paper variant="outlined" sx={{ px: 2, py: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Status da transmissão
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="overline">Última transmissão</Typography>
              <Typography variant="body1">
                {channel.lastBroadcast
                  ? dayjs(channel.lastBroadcast).format('DD/MM/YYYY HH:mm')
                  : 'Nunca transmitiu'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="overline">Espectadores</Typography>
              <Typography variant="body1">{channel.viewers}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="overline" sx={{ display: 'block' }}>
                Status
              </Typography>
              <Chip
                label={channel.status}
                size="small"
                color={channel.status === 'ONLINE' ? 'success' : 'default'}
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Nome do Canal</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.name}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Categoria</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.category}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Descrição</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Grupo Multicast</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.multicastGroup}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Porta</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.port}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Thumbnail</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.thumbnailUrl ?? 'Nenhuma imagem'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Vídeo</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.videoUrl ?? 'Nenhum vídeo'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Canal ativo</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.isActive ? 'Sim' : 'Não'}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Iniciar automaticamente</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {channel.autoStart ? 'Sim' : 'Não'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Voltar
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleChannelEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleChannelDelete}
            >
              Excluir
            </Button>
          </Stack>
        </Stack>
      </Box>
    ) : null;
  }, [
    isLoading,
    error,
    channel,
    handleBack,
    handleChannelEdit,
    handleChannelDelete,
  ]);

  const pageTitle = `Canal ${channelId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Canais', path: '/admin/channels' },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}