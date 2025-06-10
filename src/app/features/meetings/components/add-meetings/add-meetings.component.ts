import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../users/interfaces/user';
import { MeetingsService } from '../../services/meetings.service';
import { TopicsService } from '../../services/topics.service';
import { UsersService } from '../../../users/services/users.service';
import { AssistantMeetingsService } from '../../services/assistant-meetings.service';

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
  showDropdownCalledBy = false;
  showDropdownAssistant = false;
  showDropdownDirector = false;
  showDropdownSecretary = false;
  submitted = false;
  isDevelopment: boolean = false;

  [key: string]: any;

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
      assistant_id: [''],
      assistant_name: [''],
      type: ['Orden del día', Validators.required],
      topic: [''],
      director: ['', Validators.required],
      director_name: ['', Validators.required],
      secretary: ['', Validators.required],
      secretary_name: ['', Validators.required],
      title: ['']
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
              director: meeting.meeting.director.id,
              director_name: meeting.meeting.director.first_name +
              ' ' +
              meeting.meeting.director.last_name,
              secretary: meeting.meeting.secretary.id,
              secretary_name: meeting.meeting.secretary.first_name +
              ' ' +
              meeting.meeting.secretary.last_name,
            });
          }
        });
      this.getAssistants();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.meetingForm.controls;
  }

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.isDevelopment = selectElement.value === 'Desarrollo';
    if (!this.isDevelopment) {
      this.meetingForm.get('title')?.reset();
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

  onSearch(fieldName: string): void {
    const searchTerm = this.meetingForm.get(fieldName)?.value.toLowerCase();
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

  selectUser(
    user: any,
    fieldName: string,
    idFieldName: string | null,
    dropdownFlag: string
  ): void {
    const patchValue: { [key: string]: any } = {
      [fieldName]: `${user.first_name} ${user.last_name}`,
    };
    if (idFieldName) {
      patchValue[idFieldName] = user.id;
    }
    this.meetingForm.patchValue(patchValue);
    this[dropdownFlag] = false;

    if (fieldName === 'assistant_name') {
      this.selectedAssistants.push(user);
      this.meetingForm.patchValue({ assistant_name: '' });
      if (this.meetingId) {
        this.addAssistantsToMeeting();
      }
    }
  }

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

  selectCalledBy(user: any): void {
    this.selectUser(
      user,
      'called_by_name',
      'called_by',
      'showDropdownCalledBy'
    );
  }

  selectAssistant(user: any): void {
    this.selectUser(user, 'assistant_name', null, 'showDropdownAssistant');
  }

  selectDirector(user: any): void {
    this.selectUser(user, 'director_name', 'director', 'showDropdownDirector');
  }

  selectSecretary(user: any): void {
    this.selectUser(
      user,
      'secretary_name',
      'secretary',
      'showDropdownSecretary'
    );
  }

  removeAssistant(assistant: any): void {
    if (this.meetingId) {
      this.assistantService
        .deleteAssistant(this.meetingId, assistant.user_id.id)
        .subscribe({
          next: (response) => {
            location.reload();
            this.selectedAssistants = this.selectedAssistants.filter(
              (a) => a.user_id.id !== assistant.user_id.id || a.status !== 1
            );
          },
          error: (err) => {
            return;
          },
        });
    } else {
      this.selectedAssistants = this.selectedAssistants.filter(
        (a) => a.id !== assistant.id
      );
    }
  }

  addAssistantsToMeeting(): void {
    if (this.meetingId) {
      const assistantIds = this.selectedAssistants
        .filter((a) => a.id !== null && a.id !== undefined)
        .map((a) => a.id);

      this.assistantService
        .addAssistantsMeeting({
          meeting_id: this.meetingId,
          user_ids: assistantIds,
        })
        .subscribe({
          next: (value) => {
            location.reload();
          },
          error: (err) => {},
        });
    }
  }

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

  cleanTopic(topic: string): string {    
    return topic.replace(/\*/, '');
  }


  addTopic(): void {
    const title = this.meetingForm.get('title')?.value || '';
    const type = this.meetingForm.get('type')?.value;
    const topicData = this.meetingForm.get('topic')?.value;
    const topic = `${title ? `${title}:* ` : ''}${topicData}`;
    if (type && topicData) {
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

  onSubmit(): void {
    if (this.meetingForm.invalid) {
      this.submitted = true;
      return;
    }

    const meetingData = this.meetingForm.value;
    

    if (this.isEditMode && this.meetingId) {
      this.meetingsService
        .updateMeeting(this.meetingId, meetingData)
        .subscribe((l) => {
          this.router.navigate(['/meetings']);
        });
    } else {
      this.meetingsService.createMeeting(meetingData).subscribe((value) => {
        this.meetingId = value.meeting.meeting_id;
        this.addTopicsToMeeting();
        this.addAssistantsToMeeting();
        this.router.navigate(['/meetings']);
      });
    }
  }
}
