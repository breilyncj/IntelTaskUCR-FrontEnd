export interface Tarea {
  id: number;
  titulo: string;
  usuarioAsignado: number;
  estado: number;
  prioridad: number;
  complejidad: number;
  fechaLimite: Date;
  numeroGIS: string;
}

export interface TareasCreate {
  idtarea?: number;
  tareaOrigen: number; //permite null
  tituloTarea: string; //permite null
  descripcionTarea: string;
  descripcionEspera: string; //permite null
  complejidad: number;
  estado: number;
  prioridad: number;
  numeroGIS: string; //permite null
  fechaAsignacion: Date;
  fechaLimite: Date;
  fechaFinalizacion: Date;
  usuarioCreador: number;
  usuarioAsignado: number; //permite null
}
