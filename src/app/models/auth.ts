export interface LoginRequest {
  email: string;
  password: string;
}

export interface Usuario {
  nome: string;
  email: string;
  perfil: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
