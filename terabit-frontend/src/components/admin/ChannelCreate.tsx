import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  createOne as createChannel,
  validate as validateChannel,
  type ChannelCreateInput,
} from '../../data/channels';
import ChannelForm, {
  type FormFieldValue,
  type ChannelFormState,
} from './ChannelForm';
import PageContainer from './PageContainer';

const INITIAL_FORM_VALUES: Partial<ChannelFormState['values']> = {
  category: 'Notícias',
  multicastGroup: '239.10.10.1',
  port: 5004,
  isActive: true,
  autoStart: true,
};

export default function ChannelCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<ChannelFormState>(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      await createChannel(formValues as ChannelCreateInput);
      notifications.show('Canal criado com sucesso.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/admin/channels');
    } catch (createError) {
      notifications.show(
        `Falha ao criar canal. Motivo: ${(createError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="Novo Canal IPTV"
      breadcrumbs={[{ title: 'Canais', path: '/admin/channels' }, { title: 'Novo' }]}
    >
      <ChannelForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Salvar"
      />
    </PageContainer>
  );
}