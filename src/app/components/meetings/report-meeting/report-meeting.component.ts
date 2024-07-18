import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-report-meeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-meeting.component.html',
  styleUrl: './report-meeting.component.css'
})
export class ReportMeetingComponent {

  acta = {
    numero: 71,
    fecha: 'Mayo 28 de 2024',
    hora: '8 A 9:30 P.M.',
    tipoReunion: 'Reunión virtual',
    organizador: 'Jaime Valencia',
    apuntador: 'Martha Lucía Salazar',
    asistentes: [
      'Ecovivero Los Farallones - Jaime Valencia',
      'Occiverde – Martha Lucía Salazar',
      'Vivero San Miguel – Libia Quintero',
      'Ecovida Mundo Verde – Juan Felipe Arango',
      'John Jairo Imbachí – Vivero El Lido',
      'Vivero Bi Verde – Angela Marcela Carvajal',
      'Vivero Lotos – Armando Arévalo',
      'Vivero Flores Janny – Freddy Velasco',
      'Vivero Jardines Rubeiro – Rubeiro Sotelo',
      'Vivero El Rosal – Rubén Darío Ortíz',
      'Sebastián Lucuara – Director Ejecutivo'
    ],
    ordenDia: [
      'Verificación del quórum',
      'Lectura y Aprobación del acta No 70 de Mayo 27 de 2024',
      'COP 16',
      'Proposiciones y varios',
      'Clausura'
    ],
    temas: [
      {
        titulo: 'Verificación del Quorum',
        discusion: 'Se reunieron los miembros de la Junta Directiva...',
        conclusion: 'Se acuerda llevar a cabo la reunión...'
      },
      {
        titulo: 'Lectura y aprobación del acta No. 70 del 27 de mayo de 2024',
        discusion: 'Se lee el acta No. 70 de la reunión...',
        conclusion: 'La Junta Directiva, aprueba el acta No. 70...'
      },
      {
        titulo: 'COP 16',
        discusion: 'Sebastián Lucuara primero agradece a todos...',
        conclusion: 'Se decide sobre la participación en la COP 16...'
      }
    ],
    horaClausura: '9:24 PM'
  };

  constructor() { }

  ngOnInit(): void {
  }
}
