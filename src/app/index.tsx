import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';


import { Button } from '@/components/Button';
import * as alert from '@/components/helpers/CalllAlert';
import { Input } from '@/components/Input';
import { colors } from '@/constants/colors';
import * as service from '@/Services/loginServices';

import { LoginRequest } from '@/models/LoginRequest';

export default function Index() {

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const loginMutation = useMutation({
    mutationFn: service.autenticarUsuario,

    onSuccess: async (response) => {
      console.log(response);

      if (response[0].oboolean) {
        await service.guardarToken(response[0].token)
        router.replace('/home');
      }else{
        alert.callAlert(response[0])

      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  function iniciarSesion(data: LoginRequest) {
    loginMutation.mutate(data);
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        ZEUS
      </Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: 'El correo es obligatorio' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Correo electronico"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />

      {errors.email && (
        <Text style={styles.error}>
          {errors.email.message}
        </Text>
      )}

      <Controller
        control={control}
        name="password"
        rules={{
          required: 'La contraseña es obligatoria',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Contraseña"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
          />
        )}
      />

      {errors.password && (
        <Text style={styles.error}>
          {errors.password.message}
        </Text>
      )}

      <Button
        title={loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
        onPress={handleSubmit(iniciarSesion)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: colors.background,
  },

  title: {
    color: colors.quaternary,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },

  error: {
    fontSize: 13,
    marginBottom: 10,
  },
});