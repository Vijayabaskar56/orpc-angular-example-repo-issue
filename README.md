# test

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Fastify, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Fastify** - Fast, low-overhead web framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Bun** - Runtime environment
- **Mongoose** - TypeScript-first ORM
- **MongoDB** - Database engine
- **Authentication** - Email & password authentication with Better Auth
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```
## Database Setup

This project uses MongoDB with Mongoose.

1. Make sure you have MongoDB set up.
2. Update your `apps/server/.env` file with your MongoDB connection URI.

3. Apply the schema to your database:
```bash
bun db:push
```


Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

The API is running at [http://localhost:3000](http://localhost:3000).



## Project Structure

```
test/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Fastify, ORPC)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI






import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectForm, injectStore, TanStackField } from '@tanstack/angular-form';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { todoSchema } from '../../models/validation.model';
import { trpcService } from 'src/services/trpc.service';
@Component({
 selector: 'app-todo-list',
 standalone: true,
 imports: [CommonModule, FormsModule, TanStackField],
 template: `
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white dark:bg-[#111111] w-full max-w-md mx-auto rounded-lg shadow-lg animate-fade-in border border-gray-200 dark:border-gray-800">
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Todo List</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Manage your tasks efficiently</p>

          <div class="flex flex-col gap-2 mb-6">
            <div class="flex gap-2" [tanstackField]="todoForm" name="todo" #todo="field">
              <input
                class="flex-1 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                [name]="todo.api.name"
                [id]="todo.api.name"
                [value]="todo.api.state.value"
                (input)="todo.api.handleChange($any($event).target.value)"
                placeholder="Add a new task..."
                (keyup.enter)="todoForm.handleSubmit()"
              />
              <button
                type="button"
                class="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                (click)="todoForm.handleSubmit()"
                [disabled]="!canSubmit()"
              >
                <span *ngIf="isSubmitting()" class="loading loading-spinner mr-2"></span>
                {{ isSubmitting() ? 'Adding...' : 'Add' }}
              </button>
            </div>

            @if (todo.api.state.meta.isDirty && todo.api.state.meta.errors) {
              @for (error of todo.api.state.meta.errors; track $index) {
                <span class="text-sm text-red-500 mt-1">{{ error.message }}</span>
              }
            }
          </div>
        </div>

        <div class="divide-y divide-gray-200 dark:divide-gray-800">
          @if (queryToDo.data()?.length) {
            @for (todo of queryToDo.data(); track $index) {
              <div class="todo-item group">
      <button
        class="w-5 h-5 shrink-0 rounded-sm border transition-all duration-200"
        [class.bg-primary-500]="todo.completed"
        [class.border-gray-300]="!todo.completed"
        [class.dark:border-gray-600]="!todo.completed"
        [class.border-primary-500]="todo.completed"
        (click)="updateToDo.mutate(todo)"
        aria-label="Toggle todo completion"
      >
        <svg
          *ngIf="todo.completed"
          class="w-full h-full text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
        </svg>
      </button>

      <span
        class="flex-1 transition-all duration-200"
        [class.line-through]="todo.completed"
        [class.text-gray-500]="todo.completed"
        [class.dark:text-gray-400]="todo.completed"
      >
        {{ todo.text }}
      </span>

      <button
        class="text-gray-400 hover:text-error-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        (click)="deleteTodo.mutate(todo.id!)"
        aria-label="Delete todo"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
              </div>
            }
          } @else {
            <div class="p-6 text-center text-gray-600 dark:text-gray-400">
              <p>No tasks yet. Add your first task above!</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TodoListComponent {
 private _trpc = inject(trpcService);
 queryToDo = injectQuery(() => ({
  queryKey: ["todo"],
  queryFn: () => this._trpc.proxy.todo.getAll.query(),
 }));
 constructor() {
  console.log(this.queryToDo.data(), "todos");
 }
 mutateToDo = injectMutation(() => ({
  mutationFn: (todo: string) => {
   return this._trpc.proxy.todo.create.mutate({ text: todo });
  },
  onSuccess: () => {
   this.queryClient.invalidateQueries({ queryKey: ["todo"] });
   this.todoForm.reset();
  },
 }));
 updateToDo = injectMutation(() => ({
  mutationFn: (todo: Awaited<ReturnType<typeof this._trpc.proxy.todo.getAll.query>>[number]) => {
   console.log(todo, "todoForm");
   return this._trpc.proxy.todo.toggle.mutate({
    id: todo.id!,
    completed: !todo.completed,
   });
  },
  onSuccess: () => {
   this.queryClient.invalidateQueries({ queryKey: ["todo"] });
   this.todoForm.reset();
  },
 }));
 deleteTodo = injectMutation(() => ({
  mutationFn: (id: string) => {
   return this._trpc.proxy.todo.delete.mutate({ id: id });
  },
  onSuccess: () => {
   this.queryClient.invalidateQueries({ queryKey: ["todo"] });
  },
 }));

 queryClient = inject(QueryClient);
 todoForm = injectForm({
  defaultValues: {
   todo: "",
  },
  validators: {
   onChange: todoSchema,
  },
  onSubmit: async ({ value }) => {
   this.mutateToDo.mutate(value.todo);
  },
 });
 canSubmit = injectStore(this.todoForm, (state) => state.canSubmit);
 isSubmitting = injectStore(this.todoForm, (state) => state.isSubmitting);

}
