export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  correo_usuario: string;
  contrasenna: string;
  id_rol: number;
  estado: boolean;
  fecha_nacimiento: Date;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}


export interface UsuarioAsignado {
  id_usuario: number;
  nombre_usuario: string;
  correo_usuario: string;
  cantidadTareasAsignadas: number;
}

export interface TareaDetalle {
  cN_Id_tarea: number;
  cT_Titulo_tarea: string;
  cN_Id_estado: number;
  cF_Fecha_limite: string;
  cN_Id_prioridad: number;
}

export interface UsuarioConDetalle {
  cN_Id_usuario: number;
  cT_Nombre_usuario: string;
  cT_Correo_usuario: string;
  cN_Id_rol: number;
  tareasUsuarioAsignado: TareaDetalle[];
}
