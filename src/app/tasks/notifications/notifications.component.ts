import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notification } from '../../models/notification';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  notificationSub: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationSub = this.notificationService.notifications.subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      }
    });
  }

  ngOnDestroy() {
    this.notificationSub.unsubscribe();
  }

}
