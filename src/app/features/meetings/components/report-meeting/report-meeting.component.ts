import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meetings } from '../../interfaces/meetings';
import { Assistants } from '../../interfaces/assistants';
import { Topic } from '../../interfaces/topics';
import { Tasks } from '../../../tasks/interfaces/tasks';
import { MeetingsService } from '../../services/meetings.service';
import { TaskService } from '../../../tasks/services/task.service';
import { TopicsService } from '../../services/topics.service';
import { AssistantMeetingsService } from '../../services/assistant-meetings.service';

@Component({
  selector: 'app-report-meeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-meeting.component.html',
  styleUrl: './report-meeting.component.css',
})
export class ReportMeetingComponent {
  meetingId: number | null = null;
  meeting: Meetings = {
    meeting_id: 0,
    meeting_date: '',
    start_hour: '',
    called_by: {
      id: 0,
      first_name: '',
      last_name: '',
      document_number: '',
      user_type: '',
      status: 0,
    },
    placement: '',
    meeting_description: '',
    topics: '',
    created_by: {
      id: 0,
      first_name: '',
      last_name: '',
      document_number: '',
      user_type: '',
      status: 0,
    },
    creation_date: '',
    status: {
      status: 0,
      description: '',
      module: '',
      icon: '',
      class: '',
      title: '',
    },
    director: {
      id: 0,
      first_name: '',
      last_name: '',
      document_number: '',
      user_type: '',
      status: 0
    },
    secretary: {
      id: 0,
      first_name: '',
      last_name: '',
      document_number: '',
      user_type: '',
      status: 0
    }
  };
  assistants: Assistants[] = [];
  topics: Topic[] = [];
  tasks: Tasks[] = [];



  constructor(
    private meetingService: MeetingsService,
    private taskService: TaskService,
    private topicService: TopicsService,
    private assistantService: AssistantMeetingsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.meetingId = +id;
        this.getMeeting();
        this.getAssistant();
        this.getTopic();
        this.getTask();
      }
    });
  }

  getMeeting(): void {
    if (this.meetingId) {
      this.meetingService
        .getMeetingById(this.meetingId)
        .subscribe((meeting) => {
          this.meeting = meeting.meeting;
        });
    }
  }

  getAssistant(): void {
    this.assistantService
      .getAssistantByMeeting(this.meetingId)
      .subscribe((assistant) => {
        this.assistants = assistant.assistants;
      });
  }

  getTopic(): void {
    this.topicService.getTopicsByMeetingId(this.meetingId).subscribe((response) => {
      this.topics = response.topics.map((topic: Topic) => ({
        ...topic,
        formattedTopic: this.formatTopic(topic.topic)
      }));
    });
  }

  formatTopic(topicText: string): string {
    const parts = topicText.split('*');
    if (parts.length > 1) {
      return `<b>${parts[0]}</b> <br> ${parts[1]}`;
    }
    return topicText;
  }

  getTask(): void {
    this.taskService.getTaskByMeetingId(this.meetingId).subscribe((task) => {
      this.tasks = task.tasks
    })
  }
}
