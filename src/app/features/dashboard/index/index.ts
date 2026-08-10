import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '../../../core/services/authenticate';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})
export class Index implements OnInit {
  username: string = '';

  constructor(private authService: AuthenticateService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = user.username || 'Admin';
  }

}
