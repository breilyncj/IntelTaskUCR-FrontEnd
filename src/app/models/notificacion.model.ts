export interface NotificacionXUsuario {
  cN_Id_usuario: number;
  cT_Correo_destino: string;
}

export interface Notificacion {
  cN_Id_notificacion?: number;
  cN_Tipo_notificacion: number;
  cT_Titulo_notificacion: string;
  cT_Texto_notificacion: string;
  cT_Correo_origen: string;
  cF_Fecha_registro: Date;
  cF_Fecha_notificacion: Date;
  cN_Id_recordatorio?: number | null
  notificacionesXUsuarios: NotificacionXUsuario[] | null;
}
