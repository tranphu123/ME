import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScoreRecordQuestion } from '../../../../_core/_models/score-record-question';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from '../../../../_core/_services/alertify.service';
import { ScoreRecordService } from '../../../../_core/_services/score-record.service';

@Component({
  selector: 'app-sixs-score-record-edit',
  templateUrl: './sixs-score-record-edit.component.html',
  styleUrls: ['./sixs-score-record-edit.component.scss']
})
export class SixsScoreRecordEditComponent implements OnInit, OnDestroy {
  questions: ScoreRecordQuestion[] = [];
  recordId: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private scoreRecordService: ScoreRecordService,
    private alertifyService: AlertifyService) { }

  ngOnDestroy(): void {
    const questionEditSixs = [];
    this.scoreRecordService.changeQuestionEditSixs(questionEditSixs);
  }

  ngOnInit() {
    this.scoreRecordService.recordId.subscribe(res => {
      this.recordId = res;
    });
    this.scoreRecordService.currentQuestionEditSixs.subscribe(res => {
      this.questions = res;
    });
  }

  checkChange(item: ScoreRecordQuestion, number) {
    if (number === 0) {
      item.rating_0 = 1;
      item.rating_1 = 0;
      item.rating_2 = 0;
      item.rate_Na = 0;
      item.remark = null;
    }
    if (number === 1) {
      item.rating_0 = 0;
      item.rating_1 = 1;
      item.rating_2 = 0;
      item.rate_Na = 0;
      item.remark = null;
    }
    if (number === 2) {
      item.rating_0 = 0;
      item.rating_1 = 0;
      item.rating_2 = 1;
      item.rate_Na = 0;
      item.remark = null;
    }
    if (number === 3) {
      item.rating_0 = 0;
      item.rating_1 = 0;
      item.rating_2 = 0;
      item.rate_Na = 1;
      item.remark = null;
    }
  }

  back() {
    this.router.navigate(['/maintenance/6s-score-record/detail/']);
  }

  save() {
    this.scoreRecordService.saveQuestionEditSixs(this.questions).subscribe(() => {
      this.alertifyService.success('Save success');
      this.router.navigate(['/maintenance/6s-score-record/detail/']);
    }, error => {
      this.alertifyService.error(error);
    });
  }
}
