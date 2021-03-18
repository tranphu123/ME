import { Component, OnInit } from '@angular/core';
import { ScoreRecordQuestion } from '../../../../_core/_models/score-record-question';
import { WaterSpiderScoreRecordService } from '../../../../_core/_services/water-spider-score-record.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from '../../../../_core/_services/alertify.service';

@Component({
  selector: 'app-water-spider-score-record-edit',
  templateUrl: './water-spider-score-record-edit.component.html',
  styleUrls: ['./water-spider-score-record-edit.component.scss']
})
export class WaterSpiderScoreRecordEditComponent implements OnInit {
  questions: ScoreRecordQuestion[] = [];
  recordId: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private waterSpiderScoreRecordService: WaterSpiderScoreRecordService,
    private alertifyService: AlertifyService) { }
    
  ngOnDestroy(): void {
    const questionEditWaterSpider = [];
    this.waterSpiderScoreRecordService.changeQuestionEditWaterSpider(questionEditWaterSpider);
  }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.recordId = param['recordId'];
    });
    this.waterSpiderScoreRecordService.currentQuestionEditWaterSpider.subscribe(res => {
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
    this.router.navigate(['/maintenance/water-spider-score-record/detail/' + this.recordId]);
  }

  save() {
    this.waterSpiderScoreRecordService.saveQuestionEditWaterSpider(this.questions).subscribe(() => {
      this.alertifyService.success('Save success');
      this.router.navigate(['/maintenance/water-spider-score-record/detail/' + this.recordId]);
    }, error => {
      this.alertifyService.error(error);
    });
  }

}
