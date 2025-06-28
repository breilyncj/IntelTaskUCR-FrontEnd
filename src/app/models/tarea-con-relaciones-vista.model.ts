export interface Adjunto {
  cN_Id_adjuntos: number;
  cT_Archivo_ruta: string;
  cN_Usuario_accion: number;
  cF_Fecha_registro: Date;
  nombreArchivo: string;
}

export interface TareaConRelacionesVista {
  id: number;
  titulo: string;
  usuarioAsignado: string;
  usuarioCreador: string;
  estado: string;
  prioridad: string;
  complejidad: string;
  descripcion: string;
  descripcionEsperada: string;
  fechaAsignacion: Date;
  fechaLimite: Date;
  fechaFinalizacion: Date;
  numeroGIS: string;
  tareaOrigen: number | null;
  adjuntos: Adjunto[];
}




