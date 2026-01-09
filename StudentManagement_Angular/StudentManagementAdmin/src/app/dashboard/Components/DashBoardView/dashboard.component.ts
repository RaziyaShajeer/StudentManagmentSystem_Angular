import { Component, OnInit } from '@angular/core';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { CollegeService } from 'src/app/college/Services/college.service';
import { CourseService } from 'src/app/course/Services/course.service';
import { BatchService} from 'src/app/batch/Services/batch.service';
import { ReportService } from 'src/app/report/Services/report.service';
import { DashboardService } from '../../Services/dashboard.service';
import { PlacementsService } from 'src/app/placements/Services/placements.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  studentCount: number = 0;
  collegeCount: number = 0;
  courseCount: number = 0;
  batchCount: number = 0;
  enrolledCount:number=0;
  
  reportcount :number=0;

  placementCount: number = 0;



  constructor(
    private trialStudentService: TrialStudentService,
    private collegeService: CollegeService,
    private courseService: CourseService,
    private batchService: BatchService,
    private reportService:ReportService,
    private DashboardService: DashboardService,
    private PlacementsService: PlacementsService

  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    this.trialStudentService.getTrialStudents().subscribe(
      (students) => this.studentCount = students.length,
      (error) => console.error('Error loading trial students count:', error)
    );

    this.collegeService.getColleges().subscribe(
      (colleges) => this.collegeCount = colleges.length,
      (error) => console.error('Error loading colleges count:', error)
    );

    this.courseService.getAllCourses().subscribe(
      (courses) => this.courseCount = courses.length,
      (error) => console.error('Error loading courses count:', error)
    );

    this.batchService.getBatches().subscribe(
      (batches) => this.batchCount = batches.length,
      (error) => console.error('Error loading batches count:', error)
    );

    //  this.batchService.getBatches().subscribe(
    //   (batches) => this.batchCount = batches.length,
    //   (error) => console.error('Error loading batches count:', error)
    // );

    this.trialStudentService.getEnrolledStudents().subscribe(
      (enrolled) => this.enrolledCount = enrolled.length,
      (error) => console.error('Error loading batches count:', error)
    );

    this.PlacementsService.getPlacements().subscribe(
      (placements) => this.placementCount = placements.length,
      (error) => console.error('Error loading placements count:', error)
    );


   
  }

}
