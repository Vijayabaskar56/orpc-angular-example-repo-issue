import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { createAuthClient } from "better-auth/client";
import type { User } from 'better-auth/types';
import { toast } from 'ngx-sonner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class AuthService {
 private isAuthenticated = new BehaviorSubject<boolean>(false);
 isAuthenticated$ = this.isAuthenticated.asObservable();
 user = signal<User | null>(null);
 authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
 });
 router = inject(Router);
 constructor() {
  this.getSession();
 }

 login(email: string, password: string): void {
  this.authClient.signIn.email({ email, password }, {
   onSuccess: (session) => {
    this.isAuthenticated.next(true);
    this.user.set(session.data?.user ?? null);
    this.router.navigate(['/dashboard']);
   },
   onError: (error) => {
    console.error(error);
    toast.error(error.error.message);
   }
  });
 }
 signUp(email: string, password: string): void {
  this.authClient.signUp.email({ email, password, name: email }, {
   onSuccess: (session) => {
    this.isAuthenticated.next(true);
    this.user.set(session.data?.user ?? null);
    this.router.navigate(['/dashboard']);
   },
   onError: (error) => {
    console.error(error);
    toast.error(error.error.message);
   }
  });
 }

 getSession(): void {
  this.authClient.getSession({}, {
   onSuccess: (session) => {
    this.isAuthenticated.next(true);
    this.user.set(session.data?.user ?? null);
   },
   onError: (error) => {
    console.error(error);
    toast.error(error.error.message);
   }
  });
 }
 logout(): void {
  this.authClient.signOut({}, {
   onSuccess: () => {
    this.isAuthenticated.next(false);
    this.user.set(null);
    this.router.navigate(['/login']);
   },
   onError: (error) => {
    console.error(error);
    toast.error(error.error.message);
   }
  });
 }
 isLoggedIn(): boolean {
  return this.isAuthenticated.value;
 }
}
