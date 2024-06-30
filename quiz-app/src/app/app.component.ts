import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuizAppComponent } from "./quiz-app/quiz-app.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, QuizAppComponent]
})
export class AppComponent {
  title = 'quiz-app';

}
