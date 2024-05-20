import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../Interfaces/User';
import { UserService } from '../Services/User.service';
import { AuthService } from '../Services/AuthService.service';
import { AuthorizedService } from '../Services/Authorized.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  showPopup: boolean = false;
  user!: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private authorizedService: AuthorizedService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.authorizedService.UserID).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response && response.farmer && response.user) {
          const farmer = response.farmer[0]; 
          const user = response.user[0]; 
          this.user = {
            id: user._id,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            email: farmer.email,
            password: farmer.password,
            farmName: user.farmName,
            farmStatus: user.farmStatus,
            applications: user.applications,
            contracts: user.contracts,
            plans: user.plans,
            tasks: user.tasks
          };
          console.log('User:', this.user);
        } else {
          console.error('Farmer or User not found in response');
        }
      },
      error: error => {
        console.error('Error loading user data:', error);
      }
    });
  }
  
  togglePopup(): void {
    this.showPopup = !this.showPopup;
  }

  changePassword(newPassword: string): void {
    if (this.user) {
      this.userService.changePassword(this.authorizedService.UserID, newPassword).subscribe({
        next: response => {
          console.log('Password changed successfully');
          this.togglePopup();
        },
        error: error => {
          console.error('Error changing password:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.authorizedService.UserID = '';
    this.router.navigate(['/']);
}
}
