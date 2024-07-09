import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MeetingsService } from '../../../services/meetings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicsService } from '../../../services/topics.service';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { AssistantMeetingsService } from '../../../services/assistant-meetings.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-add-meetings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-meetings.component.html',
  styleUrl: './add-meetings.component.css',
})
export class AddMeetingsComponent implements OnInit {
  meetingForm: FormGroup;
  isEditMode: boolean = false;
  isCreateMode: boolean = false;
  meetingId: number | null = null;
  topicList: any[] = [];
  searchTerm: string = '';
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedAssistants: any[] = [];
  newAssistants: any[] = [];
  showDropdown = false;
  showDropdownAssistant = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private meetingsService: MeetingsService,
    private topicsService: TopicsService,
    private userService: UsersService,
    private assistantService: AssistantMeetingsService
  ) {
    this.meetingForm = this.fb.group({
      meeting_date: ['', Validators.required],
      start_hour: ['', Validators.required],
      called_by: ['', Validators.required],
      called_by_name: ['', Validators.required],
      placement: ['', Validators.required],
      meeting_description: ['', Validators.required],
      assistant_id: ['', Validators.required],
      assistant_name: ['', Validators.required],
      type: ['Orden del día', Validators.required],
      topic: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const mode = this.route.snapshot.data['mode'];

      if (id) {
        this.meetingId = +id;
        this.isEditMode = mode === 'edit';
        this.loadMeeting();
      } else {
        this.isCreateMode = true;
      }
    });
    if (this.isEditMode) {
      this.getTopics();
    }
    this.getUsers();
  }

  loadMeeting(): void {
    if (this.meetingId) {
      this.meetingsService
        .getMeetingById(this.meetingId)
        .subscribe((meeting) => {
          this.meetingId = meeting.meeting.meeting_id;
          this.meetingForm.patchValue(meeting.meeting);

          if (meeting.meeting) {
            this.meetingForm.patchValue({
              topic: '',
              called_by: meeting.meeting.called_by.id,
              called_by_name:
                meeting.meeting.called_by.first_name +
                ' ' +
                meeting.meeting.called_by.last_name,
            });
          }
        });
      this.getAssistants();
    }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (value) => {
        this.users = value;
      },
      error: (err) => {},
    });
  }

  onSearch(): void {
    const searchTerm = this.meetingForm
      .get('called_by_name')
      ?.value.toLowerCase();
    if (searchTerm) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm) ||
          user.last_name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUsers = [];
    }
  }

  selectUser(user: any): void {
    this.meetingForm.patchValue({
      called_by: user.id,
      called_by_name: `${user.first_name} ${user.last_name}`,
    });
    this.showDropdown = false;
  }

  // METODOS PARA LOS ASISTENTES DE REUNIONES
  getAssistants(): void {
    if (this.meetingId) {
      this.assistantService.getAssistantByMeeting(this.meetingId).subscribe({
        next: (value) => {
          this.selectedAssistants = value.assistants;
        },
        error: (err) => {},
      });
    }
  }

  onSearchAssistant(): void {
    const searchTerm = this.meetingForm
      .get('assistant_name')
      ?.value.toLowerCase();
    if (searchTerm) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm) ||
          user.last_name.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredUsers = [];
    }
  }

  selectAssistant(user: any): void {
    this.selectedAssistants.push(user);
    this.meetingForm.patchValue({ assistant_name: '' });
    this.showDropdownAssistant = false;
    if(this.meetingId){
      this.addAssistantsToMeeting();
    }
  }

  removeAssistant(assistant: any): void {
    if (this.meetingId) {
      
      this.assistantService.deleteAssistant(this.meetingId, assistant.user_id.id).subscribe({
        next: (response) => {
          location.reload()
          // Elimina el asistente de la lista local después de una eliminación exitosa
          this.selectedAssistants = this.selectedAssistants.filter(
            (a) => a.user_id.id !== assistant.user_id.id || a.status !== 1
          );
        },
        error: (err) => {
          return
        },
      });
    } else {
      // Elimina el asistente de la lista local si no hay un meetingId
      this.selectedAssistants = this.selectedAssistants.filter(
        (a) => a.id !== assistant.id
      );
    }
  }

  addAssistantsToMeeting(): void {
    if (this.meetingId) {
      // Filtrar los asistentes que tienen un id no nulo y luego mapear para obtener solo los ids
      const assistantIds = this.selectedAssistants
        .filter(a => a.id !== null && a.id !== undefined)
        .map(a => a.id);
  
      this.assistantService
        .addAssistantsMeeting({
          meeting_id: this.meetingId,
          user_ids: assistantIds,
        })
        .subscribe({
          next: (value) => {
            // Manejar la respuesta exitosa
            location.reload()
          },
          error: (err) => {
            // Manejar el error
          },
        });
    }
    else {

    }
  }

  // METODOS PARA TOPICS
  getTopics(): void {
    if (this.meetingId) {
      this.topicsService.getTopicsByMeetingId(this.meetingId).subscribe({
        next: (value) => {
          this.topicList = value.topics;
        },
        error: (err) => {},
      });
    }
  }

  addTopic(): void {
    const type = this.meetingForm.get('type')?.value;
    const topic = this.meetingForm.get('topic')?.value;
    if (type && topic) {
      this.topicList.push({ type, topic, status: 2 });
      if (this.isEditMode) {
        this.addTopicService(type, topic, this.meetingId);
      }
    }
  }

  addTopicService(type: string, topic: string, id: any): void {
    this.topicsService
      .createTopic({
        meeting_id: id,
        type: type,
        topic: topic,
        created_by: 1,
      })
      .subscribe({
        next: (value) => {},
        error: (err) => {},
      });
  }

  removeTopic(id: number): void {
    this.topicsService.deleteTopic(id).subscribe({
      next: (value) => {
        location.reload();
      },
    });
  }

  addTopicsToMeeting(): void {
    if (this.meetingId) {
      for (let topic of this.topicList) {
        this.addTopicService(topic.type, topic.topic, this.meetingId);
      }
    }
  }

  // METODO PARA ENVIAR FORMULARIO
  onSubmit(): void {
    const meetingData = this.meetingForm.value;

    if (this.isEditMode && this.meetingId) {
      this.meetingsService
        .updateMeeting(this.meetingId, meetingData)
        .subscribe(() => { // Agrega los asistentes después de actualizar la reunión
          this.router.navigate(['/meetings']); // Redirige a la lista de reuniones
        });
    } else {
      this.meetingsService.createMeeting(meetingData).subscribe((value) => {
        this.meetingId = value.meeting.meeting_id;
        this.addTopicsToMeeting();
        this.addAssistantsToMeeting(); // Agrega los asistentes después de crear la reunión
        this.router.navigate(['/meetings']); // Redirige a la lista de reuniones
      });
    }
  }
}
