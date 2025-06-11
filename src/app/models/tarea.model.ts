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
