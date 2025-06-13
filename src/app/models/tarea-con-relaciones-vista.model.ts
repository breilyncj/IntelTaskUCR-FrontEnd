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
}
