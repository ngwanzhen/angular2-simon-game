import { Component } from '@angular/core';
import async from 'async';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  greenClick = false;
  yellowClick = false;
  blueClick = false;
  redClick = false;
  compsequence: number[] = [];
  playersequence: number[] = [];
  arr: any[];
  playerturn: Boolean;
  score = 0;
  gameOver: Boolean;
  audio = new Audio();

  // start game should trigger 1 push to sequence
  // sequence push should trigger game clicks, then trigger player turn
  // player turn should push to player sequence after every click Event, then trigger check win
  // if check win true, trigger change turn add score, trigger upLevel
  // else score reset, compsequence reset, show game over. regardless of win or not, reset player sequence

  startGame () {
    this.gameOver = false;
    this.playerturn = false;
    return this.upLevel();
  }

  upLevel () {
    this.compsequence.push(this.getRandomIntInclusive(0, 3));
    console.log(this.compsequence);
    setTimeout(() => { this.compClicks(); }, 1000);
  }

  compClicks () {
    this.arr = [];
    for (let i = 0; i < this.compsequence.length; i++) {
      this.arr.push(new Promise((resolve, reject) => {
        setTimeout(() => {this.clickEvent(this.compsequence[i]);
        resolve(); }, i * 1000);
      }
    ));
    }
    Promise.all(this.arr)
    .then(() => {
      this.changeTurn('player');
      this.checkWin();
    });
  }

  changeTurn (who): void {
    who === 'player' ? this.playerturn = true : this.playerturn = false;
  }

  checkWin () {
    if (this.playersequence.length === this.compsequence.length) {
      if (this.playersequence.toString() === this.compsequence.toString()) {
        this.playersequence = [];
        return this.winningFunction();
      } else {
        this.playersequence = [];
        return this.losingFunction(); }
    }
  }

  winningFunction (): void {
    this.changeTurn('comp');
    this.score++;
    this.upLevel();
  }

  losingFunction (): void {
    this.score = 0;
    this.compsequence = [];
    this.gameOver = true;
  }

  clickEvent (num: number) {
    // add clicks to player sequence
      if (this.playerturn) { this.playersequence.push(num); }
      // TODO: should be able to refactor changing of greenClick, blueClick etc. to one function such that I can setTimeout on that
      if (num === 0) {
        this.greenClick = ! this.greenClick;
        setTimeout(() => {this.greenClick = !this.greenClick; }, 500);
        this.play('c');
      }
      if (num === 1) {
        this.blueClick = ! this.blueClick;
        setTimeout(() => {
        this.blueClick = !this.blueClick; }, 500);
        this.play('d');
      }
      if (num === 2) {
        this.yellowClick = ! this.yellowClick;
        setTimeout(() => {
        this.yellowClick = !this.yellowClick; }, 500);
        this.play('e');
      }
      if (num === 3) {
        this.redClick = ! this.redClick;
        setTimeout(() => {
        this.redClick = !this.redClick; }, 500);
        this.play('f');
      }
      this.checkWin();
  }

  highlight (num, color) {
    if (this.greenClick && num === 0) {
      return color;
    }
    if (this.blueClick && num === 1) {
      return color;
    }
    if (this.yellowClick && num === 2) {
      return color;
    }
    if (this.redClick && num === 3) {
      return color;
    }
  }

  play (note) {
    if (note === 'c') {this.audio.src = '../assets/piano-c.wav'; }
    if (note === 'd') {this.audio.src = '../assets/piano-d.wav'; }
    if (note === 'e') {this.audio.src = '../assets/piano-e.wav'; }
    if (note === 'f') {this.audio.src = '../assets/piano-f.wav'; }
    this.audio.load();
    this.audio.play();
}

  getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
