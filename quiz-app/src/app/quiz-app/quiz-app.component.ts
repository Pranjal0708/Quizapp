import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-quiz-app',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './quiz-app.component.html',
  styleUrl: './quiz-app.component.css'
})

export class QuizAppComponent implements OnInit, OnDestroy, AfterViewInit {
  apiUrl = 'https://mocki.io/v1/491a07e5-507c-4706-8196-4fa9497b7ab5';
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  timeLeft: number = 0;
  timerSubscription: Subscription | undefined;
  correctAnswers: boolean[] = [];
  quizCompleted: boolean = false;
  selectedAnswers: { [key: number]: any } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(this.apiUrl).subscribe((data: any) => {
        this.questions = data.questions;
      },
      (error: any) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.questions.length > 0) {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timeLeft = this.questions[this.currentQuestionIndex].timeLimit;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.NextQuestion();
      }
    });
  }

  selectAnswer(type: string, event: any) {
    let answer: any;
    if (type === 'dropdown') {
      answer = (event.target as HTMLSelectElement).value;
    } else {
      answer = event;
    }

    this.selectedAnswers[this.currentQuestionIndex] = answer;
    console.log(this.selectedAnswers);
  }

  NextQuestion() {
    this.evaluateAnswer();
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.startTimer();
    } else {
      this.quizCompleted = true;
      this.timerSubscription?.unsubscribe();
    }
  }

  evaluateAnswer() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const selectedAnswer = this.selectedAnswers[this.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    this.correctAnswers.push(isCorrect);
  }

  submit() {
    this.evaluateAnswer();
    this.quizCompleted = true;
    this.timerSubscription?.unsubscribe();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }
}
