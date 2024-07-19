import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
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
  showDropdownCalledBy = false;
  showDropdownAssistant = false;
  showDropdownDirector = false;
  showDropdownSecretary = false;
  submitted = false;

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
      secretary_name: ['', Validators.required]
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

  get f(): { [key: string]: AbstractControl } {
    return this.meetingForm.controls;
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

  selectUser(user: any, fieldName: string, idFieldName: string | null, dropdownFlag: string): void {
    const patchValue: { [key: string]: any } = {
      [fieldName]: `${user.first_name} ${user.last_name}`
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
    this.selectUser(user, 'called_by_name', 'called_by', 'showDropdownCalledBy');
  }

  selectAssistant(user: any): void {
    this.selectUser(user, 'assistant_name', null, 'showDropdownAssistant');
  }

  selectDirector(user: any): void {
    this.selectUser(user, 'director_name', 'director', 'showDropdownDirector');
  }

  selectSecretary(user: any): void {
    this.selectUser(user, 'secretary_name', 'secretary', 'showDropdownSecretary');
  }

  removeAssistant(assistant: any): void {
    if (this.meetingId) {
      this.assistantService.deleteAssistant(this.meetingId, assistant.user_id.id).subscribe({
        next: (response) => {
          location.reload()
          this.selectedAssistants = this.selectedAssistants.filter(
            (a) => a.user_id.id !== assistant.user_id.id || a.status !== 1
          );
        },
        error: (err) => {
          return
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
        .filter(a => a.id !== null && a.id !== undefined)
        .map(a => a.id);
  
      this.assistantService
        .addAssistantsMeeting({
          meeting_id: this.meetingId,
          user_ids: assistantIds,
        })
        .subscribe({
          next: (value) => {
            location.reload()
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

  onSubmit(): void {
    if (this.meetingForm.invalid) {
      this.submitted = true;
      return;
    }

    const meetingData = this.meetingForm.value;

    if (this.isEditMode && this.meetingId) {
      this.meetingsService
        .updateMeeting(this.meetingId, meetingData)
        .subscribe(() => {
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
