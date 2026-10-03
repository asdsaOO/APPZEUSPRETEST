

import { LoginRequest } from '@/models/LoginRequest'
import { LoginResponse } from '@/models/responses/LoginResponse'
import { TokenPayloadDTO } from '@/models/TokenPayloadDTO'
import * as SecureStore from 'expo-secure-store'
import { jwtDecode } from 'jwt-decode'
import { Platform } from 'react-native'
import { api } from '../config/api'



async function autenticarUsuario(
  data: LoginRequest
): Promise<LoginResponse[]> {
  const response = await api.post<LoginResponse[]>('/account/authUser', {
    ...data,
    email: data.email.trim().toLowerCase(),
  });

  return response.data;
}


export async function guardarToken(token: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem('Nkauth', token);
  } else {
    await SecureStore.setItemAsync('Nkauth', token);
  }
}

export async function obtenerToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem('Nkauth');
  }

  return await SecureStore.getItemAsync('Nkauth');
}

export async function eliminarToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('Nkauth');
  } else {
    await SecureStore.deleteItemAsync('Nkauth');
  }
}
export {
  autenticarUsuario
}
export async function obtenerPayload ():Promise<TokenPayloadDTO | null>{
  const token =await obtenerToken()
  if(!token){
    return null;
  }
  return jwtDecode<TokenPayloadDTO>(token)
}

