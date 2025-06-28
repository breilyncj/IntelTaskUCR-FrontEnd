export interface Tarea {
  id: number;
  titulo: string;
  usuarioAsignado: number;
  usuarioCreador: number;
  usuarioCreadorId: number | null;
  estado: string;
  prioridad: number;
  complejidad: number;
  fechaLimite: Date;
  numeroGIS: string;
}

export interface prioridadTarea {
  cN_Id_prioridad: number;
  cT_Nombre_prioridad: string;
}

export interface complejidadTarea {
  cN_Id_complejidad: number;
  cT_Nombre:string;
}

export interface estadoTarea {
  cN_Id_estado: number;
  cT_Estado: string;
}

export interface TareasCreate {
  cN_Id_tarea?: number;
  cN_Tarea_origen: number | null;
  cT_Titulo_tarea: string | null;
  cT_Descripcion_tarea: string;
  cT_Descripcion_espera: string | null;
  cN_Id_complejidad: number;
  cN_Id_estado: number;
  cN_Id_prioridad: number;
  cN_Numero_GIS: string | null;
  cF_Fecha_asignacion: Date;
  cF_Fecha_limite: Date;
  cF_Fecha_finalizacion: Date;
  cN_Usuario_creador: number;
  cN_Usuario_asignado: number | null;
}

export interface TareasCreate2 {
  cN_Id_tarea?: number;
  cN_Tarea_origen: number | null;
  cT_Titulo_tarea: string | null;
  cT_Descripcion_tarea: string;
  cT_Descripcion_espera: string | null;
  cN_Id_complejidad: number;
  cN_Id_estado: number;
  cN_Id_prioridad: number;
  cN_Numero_GIS: string | null;
  cF_Fecha_asignacion: Date;
  cF_Fecha_limite: Date;
  cF_Fecha_finalizacion: Date;
  cN_Usuario_creador: number;
  cN_Usuario_asignado: number | null;
  adjuntos: any;
}




export interface TareaPadre{
  cN_Id_tarea?: number;
  cN_Tarea_origen: number | null;
  cT_Titulo_tarea: string | null;
  cT_Descripcion_tarea: string;
  cT_Descripcion_espera: string | null;
  cN_Id_complejidad: number;
  cN_Id_estado: number;
  cN_Id_prioridad: number;
  cN_Numero_GIS: string | null;
  cF_Fecha_asignacion: Date;
  cF_Fecha_limite: Date;
  cF_Fecha_finalizacion: Date;
  cN_Usuario_creador: number;
  cN_Usuario_asignado: number | null;
}
