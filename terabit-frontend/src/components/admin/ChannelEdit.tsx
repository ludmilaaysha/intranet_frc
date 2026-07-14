import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  getOne as getChannel,
  updateOne as updateChannel,
  validate as validateChannel,
  type Channel,
} from '../../api/channels';
import ChannelForm, {
  type FormFieldValue,
  type ChannelFormState,
} from './ChannelForm';
import PageContainer from './PageContainer';

function ChannelEditForm({
  channel,
  onSubmit,
  onTransmissionChange,
}: {
  channel: Channel;
  onSubmit: (formValues: Partial<ChannelFormState['values']>) => Promise<void>;
  onTransmissionChange: () => void;
}) {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<ChannelFormState>(() => ({
    values: channel,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<ChannelFormState['values']>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<ChannelFormState['errors']>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof ChannelFormState['values'], value: FormFieldValue) => {
      const validateField = async (values: Partial<ChannelFormState['values']>) => {
        const { issues } = validateChannel(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(channel);
  }, [channel, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateChannel(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Canal editado com sucesso.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/admin/channels');
    } catch (editError) {
      notifications.show(
        `Falha ao editar canal. Motivo: ${(editError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <ChannelForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Salvar"
      backButtonPath={`/admin/channels/${channelId}`}
      channelId={Number(channelId)}
      streamInfo={{
        lastBroadcast: channel.lastBroadcast,
        viewers: channel.viewers,
        status: channel.status,
      }}
      onTransmissionChange={onTransmissionChange}
    />
  );
}

export default function ChannelEdit() {
  const { channelId } = useParams();

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

  const handleSubmit = React.useCallback(
    async (formValues: Partial<ChannelFormState['values']>) => {
      const updatedData = await updateChannel(Number(channelId), formValues);
      setChannel(updatedData);
    },
    [channelId],
  );

  const renderEdit = React.useMemo(() => {
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
      <ChannelEditForm channel={channel} onSubmit={handleSubmit} onTransmissionChange={loadData} />
    ) : null;
  }, [isLoading, error, channel, handleSubmit]);

  return (
    <PageContainer
      title={`Editar Canal ${channelId}`}
      breadcrumbs={[
        { title: 'Canais', path: '/admin/channels' },
        { title: `Canal ${channelId}`, path: `/admin/channels/${channelId}` },
        { title: 'Editar' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}