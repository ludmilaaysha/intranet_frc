import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { type SelectChangeEvent, type SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { CHANNEL_CATEGORIES, uploadImage, type Channel, startTransmission, stopTransmission, } from '../../api/channels';

export interface ChannelFormState {
  values: Partial<Omit<Channel, 'id'>>;
  errors: Partial<Record<keyof ChannelFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface ChannelFormProps {
  formState: ChannelFormState;
  onFieldChange: (
    name: keyof ChannelFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<ChannelFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<ChannelFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
  streamInfo?: Pick<Channel, 'lastBroadcast' | 'viewers' | 'status'>;
  channelId?: number;
  onTransmissionChange?: () => void;
}

export default function ChannelForm(props: ChannelFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
    streamInfo,
    channelId,
    onTransmissionChange,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleStartTransmission = React.useCallback(async () => {
    if (!channelId) return;
    try {
      await startTransmission(channelId);
      onTransmissionChange?.();
    } catch (err) {
      alert((err as Error).message);
    }
  }, [channelId, onTransmissionChange]);

  const handleStopTransmission = React.useCallback(async () => {
    if (!channelId) return;
    try {
      await stopTransmission(channelId);
      onTransmissionChange?.();
    } catch (err) {
      alert((err as Error).message);
    }
  }, [channelId, onTransmissionChange]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ChannelFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof ChannelFormState['values'], checked);
    },
    [onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof ChannelFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleFileFieldChange = React.useCallback(
    (fieldName: keyof ChannelFormState['values']) =>
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const url = await uploadImage(file);

        onFieldChange(fieldName, url);
      },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/admin');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      {streamInfo ? (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Status da transmissão
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Última transmissão
              </Typography>
              <Typography variant="body2">
                {streamInfo.lastBroadcast
                  ? dayjs(streamInfo.lastBroadcast).format('DD/MM/YYYY HH:mm')
                  : 'Nunca transmitiu'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Espectadores
              </Typography>
              <Typography variant="body2">{streamInfo.viewers}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Status
              </Typography>
              <Chip
                label={streamInfo.status}
                size="small"
                color={streamInfo.status === 'ONLINE' ? 'success' : 'default'}
              />
            </Grid>
          </Grid>
        </Paper>
      ) : null}

      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.name ?? ''}
              onChange={handleTextFieldChange}
              name="name"
              label="Nome do Canal"
              error={!!formErrors.name}
              helperText={formErrors.name ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.description ?? ''}
              onChange={handleTextFieldChange}
              name="description"
              label="Descrição"
              error={!!formErrors.description}
              helperText={formErrors.description ?? ' '}
              multiline
              minRows={2}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.category} fullWidth>
              <InputLabel id="channel-category-label">Categoria</InputLabel>
              <Select
                value={formValues.category ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="channel-category-label"
                name="category"
                label="Categoria"
                fullWidth
              >
                {CHANNEL_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.category ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.multicastGroup ?? ''}
              name="multicastGroup"
              label="Grupo Multicast"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              helperText="Este endereço será gerado automaticamente quando o canal for criado."
              fullWidth
            />
          </Grid> */}
          {/* <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex' }}>
            <TextField
              value="5004"
              label="Porta"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              helperText="Porta utilizada por todos os canais."
              fullWidth
            />
          </Grid> */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<ImageIcon />}
              >
                Escolher imagem
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileFieldChange('thumbnailUrl')}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                {formValues.thumbnailUrl ? String(formValues.thumbnailUrl) : 'Nenhuma imagem selecionada'}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >
                Escolher arquivo
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleFileFieldChange('videoUrl')}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                {formValues.videoUrl ? String(formValues.videoUrl) : 'Nenhum vídeo selecionado'}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name="isActive"
                control={
                  <Checkbox
                    checked={formValues.isActive ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Canal ativo"
              />
              <FormHelperText error={!!formErrors.isActive}>
                {formErrors.isActive ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name="autoStart"
                control={
                  <Checkbox
                    checked={formValues.autoStart ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Iniciar automaticamente"
              />
              {channelId && (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={streamInfo?.status === 'ONLINE'}
                    onClick={handleStartTransmission}
                  >
                    Transmitir
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    disabled={streamInfo?.status === 'OFFLINE'}
                    onClick={handleStopTransmission}
                  >
                    Encerrar
                  </Button>
                </Stack>
              )}
            {/* </Stack> */}
              <FormHelperText error={!!formErrors.autoStart}>
                {formErrors.autoStart ?? ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}