using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.ScheduleInfoes;

namespace Timetable.Site.Controllers.Api
{
    public partial class TutorialTypeController : BaseApiController<TutorialType>
    {
        public TutorialType[] GetTempTutorialTypes()
        {
            var result = new List<TutorialType>();

            var t1 = new TutorialType();
            t1.Id = 1;
            t1.Name = "Лекции";

            var t2 = new TutorialType();
            t2.Id = 2;
            t2.Name = "Практики";

            var t3 = new TutorialType();
            t3.Id = 3;
            t3.Name = "Лабораторные";

            result.Add(t1);
            result.Add(t2);
            result.Add(t3);
      
            return result.ToArray();
        }
    }

    public partial class StudyYearController : BaseApiController<StudyYear>
    {
        public StudyYear[] GetTempStudyYears()
        {
            var result = new List<StudyYear>();

       
            var s2 = new StudyYear();
            s2.Id = 1;
            //s2.Name = "2012/2013";

       
            result.Add(s2);

            return result.ToArray();
        }
    }

    public partial class WeekTypeController : BaseApiController<WeekType>
    {
        public WeekType[] GetTempWeekTypes()
        {
            var result = new List<WeekType>();


            var w1 = new WeekType();
            w1.Id = 1;
            w1.Name = "Л";

            var w2 = new WeekType();
            w2.Id = 2;
            w2.Name = "Ч";

            var w3 = new WeekType();
            w3.Id = 3;
            w3.Name = "З";

            result.Add(w1);
            result.Add(w2);
            result.Add(w3);

            return result.ToArray();
        }
    }


    public partial class FacultyController : BaseApiController<Faculty>
    {
        public Faculty[] GetTempFaculties()
        {
            var result = new List<Faculty>();
            var f1 = new Faculty();

            f1.Branch = new Branch();
            f1.Branch.Id = 1;
            f1.Id = 1;
            f1.Name = "Математический факультет";
            f1.ShortName = "Матфак";
         
            result.Add(f1);
            return result.ToArray();
        }
    }

    public partial class CourseController : BaseApiController<Course>
    {
        public Course[] GetTempCourses()
        {
            var result = new List<Course>();
            var c1 = new Course();
            var c2 = new Course();
            var c3 = new Course();
            var c4 = new Course();
            var c5 = new Course();

            c1.Id = 1;
            c1.Name = "Первый курс";

            c2.Id = 2;
            c2.Name = "Второй курс";

            c3.Id = 3;
            c3.Name = "Третий курс";

            c4.Id = 4;
            c4.Name = "Четвертый курс";

            c5.Id = 5;
            c5.Name = "Пятый курс";

            result.Add(c1);
            result.Add(c2);
            result.Add(c3);
            result.Add(c4);
            result.Add(c5);

            return result.ToArray();
        }
    }

    public partial class BuildingController : BaseApiController<Building>
    {
        public Building[] GetTempBuildings()
        {
            var result = new List<Building>();
            var b1 = new Building();
            b1.Id = 1;
            b1.Address = "";
            b1.Name = "Главный корпус";
            b1.ShortName = "ГК";

            result.Add(b1);

            var b2 = new Building();
            b2.Id = 2;
            b2.Address = "";
            b2.Name = "Теоритический корпус";
            b2.ShortName = "ТК";

            result.Add(b2);

            return result.ToArray();
        }
    }

    public partial class AuditoriumTypeController : BaseApiController<AuditoriumType>
    {
        public AuditoriumType[] GetTempAuditoriumTypes()
        {
            var result = new List<AuditoriumType>();
            var t1 = new AuditoriumType();
            t1.Id = 1;
            t1.Name = "Лекционная";
            result.Add(t1);

            var t2 = new AuditoriumType();
            t2.Id = 2;
            t2.Name = "Лабораторная";
            result.Add(t2);

            var t3 = new AuditoriumType();
            t3.Id = 3;
            t3.Name = "Дисплейная";
            result.Add(t3);

            var t4 = new AuditoriumType();
            t4.Id = 4;
            t4.Name = "Кабинет";
            result.Add(t4);


            return result.ToArray();
        }
    }

  
    public partial class BranchController : BaseApiController<Branch>
    {
        public Branch[] GetTempBranches()
        {
            var result = new List<Branch>();
            var b1 = new Branch();
            b1.Id = 1;
            b1.Name = "ПетрГУ";
            result.Add(b1);
            return result.ToArray();
        }
    }


    public partial class ScheduleInfoController : BaseApiController<ScheduleInfo>
    {
        public ScheduleInfo[] GetTempScheduleInfoes()
        {
            var result = new List<ScheduleInfo>();
            var t = new ScheduleInfo();

            var group1 = new Group();
            var group2 = new Group();
           
            group1.Id = 1;
            group2.Id = 2;
            group1.Code ="22305";
            group2.Code ="22306";

            var groups = new List<Group>();
            groups.Add(group1);
            groups.Add(group2);

            t.Groups = groups.ToArray();

            t.HoursPerWeek = 8;

            var lecturer1 = new Lecturer();
            lecturer1.Id = 1;
            lecturer1.Firstname = "Иван";
            lecturer1.Middlename = "Иванов";
            lecturer1.Lastname = "Иванович";

            t.Lecturer = lecturer1;

            var tutorialtype = new TutorialType();
            tutorialtype.Id = 1;
            tutorialtype.Name = "Л";

            t.TutorialType = tutorialtype;

            var course1 = new Course();
            course1.Id = 1;
            course1.Name = "третий курс";
            var course2 = new Course();
            course2.Id = 2;
            course2.Name = "четвертый курс";
            var courses = new List<Course>();

            courses.Add(course1);
            courses.Add(course2);

            t.Courses = courses.ToArray();

            t.Tutorial = new Tutorial();
            t.Tutorial.Id = 2345;
            t.Tutorial.Name = "Тер.вер.";
            t.Tutorial.ShortName = "Тер.вер.";

            result.Add(t);
            result.Add(t);
            result.Add(t);

            return result.ToArray();
        }
    }

    public partial class TimeController : BaseApiController<Time>
    {
        public Time[] GetTempTimes()
        {
            var result = new List<Time>();
          
            var tTime1 = new Time();
            tTime1.Building = new Building();
            tTime1.Id = 12;
            tTime1.Building.Id = 1;
            tTime1.Start = TimeSpan.Parse("8:00");
            tTime1.End = TimeSpan.Parse("9:35");
            result.Add(tTime1);

            var tTime2 = new Time();
            tTime2.Building = new Building();
            tTime2.Id = 13;
            tTime2.Building.Id = 1;
            tTime2.Start = TimeSpan.Parse("9:45");
            tTime2.End = TimeSpan.Parse("11:20");
            result.Add(tTime2);

            var tTime3 = new Time();
            tTime3.Building = new Building();
            tTime3.Id = 14;
            tTime3.Building.Id = 1;
            tTime3.Start = TimeSpan.Parse("11:30");
            tTime3.End = TimeSpan.Parse("13:05");
            result.Add(tTime3);

            var tTime4 = new Time();
            tTime4.Building = new Building();
            tTime4.Id = 15;
            tTime4.Building.Id = 1;
            tTime4.Start = TimeSpan.Parse("13:30");
            tTime4.End = TimeSpan.Parse("15:05");
            result.Add(tTime4);

            var tTime5 = new Time();
            tTime5.Building = new Building();
            tTime5.Id = 16;
            tTime5.Building.Id = 1;
            tTime5.Start = TimeSpan.Parse("15:15");
            tTime5.End = TimeSpan.Parse("16:50");
            result.Add(tTime5);

            var tTime6 = new Time();
            tTime6.Building = new Building();
            tTime6.Id = 17;
            tTime6.Building.Id = 1;
            tTime6.Start = TimeSpan.Parse("17:00");
            tTime6.End = TimeSpan.Parse("18:35");
            result.Add(tTime6);

            var tTime7 = new Time();
            tTime7.Building = new Building();
            tTime7.Id = 33;
            tTime7.Building.Id = 1;
            tTime7.Start = TimeSpan.Parse("18:35");
            tTime7.End = TimeSpan.Parse("20:00");
            result.Add(tTime7);

            return result.ToArray();
        }
    }

    public partial class ScheduleController : BaseApiController<Schedule>
    {
        public Schedule[] GetTempSchedulesForLecturer()
        {
            var result = new List<Schedule>();

            /*
            var t1 = new Schedule();
            t1.Id = 1;
            t1.DayOfWeek = 4;
            t1.Period = new Time();
            t1.Period.Id = 15;
            t1.WeekType = new WeekType();
            t1.WeekType.Id = 1;
            t1.WeekType.Name = "Л";
            t1.Auditorium = new Auditorium();
            t1.Auditorium.Id = 234;
            t1.Auditorium.Number = "361";
            t1.ScheduleInfo = GetTempScheduleInfo();

            var t2 = new Schedule();
            t2.Id = 2;
            t2.DayOfWeek = 5;
            t2.Period = new Time();
            t2.Period.Id = 16;
            t2.WeekType = new WeekType();
            t2.WeekType.Id = 2;
            t2.WeekType.Name = "Ч";
            t2.Auditorium = new Auditorium();
            t2.Auditorium.Id = 827;
            t2.Auditorium.Number = "221";
            t2.ScheduleInfo = GetTempScheduleInfo();

            var t3 = new Schedule();
            t3.Id = 3;
            t3.DayOfWeek = 4;
            t3.Period = new Time();
            t3.Period.Id = 12;
            t3.WeekType = new WeekType();
            t3.WeekType.Id = 3;
            t3.WeekType.Name = "З";
            t3.Auditorium = new Auditorium();
            t3.Auditorium.Id = 877;
            t3.Auditorium.Number = "121";
            t3.ScheduleInfo = GetTempScheduleInfo();

            result.Add(t1);
            result.Add(t2);
            result.Add(t3);*/

            return result.ToArray();
        }


        public Schedule[] GetTempSchedulesForAuditorium()
        {
            var result = new List<Schedule>();

            /*
            var t1 = new Schedule();
            t1.Id = 1;
            t1.DayOfWeek = 1;
            t1.Period = new Time();
            t1.Period.Id = 14;
            t1.WeekType = new WeekType();
            t1.WeekType.Id = 1;
            t1.WeekType.Name = "Л";
            t1.Auditorium = new Auditorium();
            t1.Auditorium.Id = 234;
            t1.Auditorium.Number = "361";
            t1.ScheduleInfo = GetTempScheduleInfo();

            var t2 = new Schedule();
            t2.Id = 2;
            t2.DayOfWeek = 3;
            t2.Period = new Time();
            t2.Period.Id = 15;
            t2.WeekType = new WeekType();
            t2.WeekType.Id = 2;
            t2.WeekType.Name = "Ч";
            t2.Auditorium = new Auditorium();
            t2.Auditorium.Id = 827;
            t2.Auditorium.Number = "221";
            t2.ScheduleInfo = GetTempScheduleInfo();

            var t3 = new Schedule();
            t3.Id = 3;
            t3.DayOfWeek = 2;
            t3.Period = new Time();
            t3.Period.Id = 14;
            t3.WeekType = new WeekType();
            t3.WeekType.Id = 3;
            t3.WeekType.Name = "З";
            t3.Auditorium = new Auditorium();
            t3.Auditorium.Id = 877;
            t3.Auditorium.Number = "121";
            t3.ScheduleInfo = GetTempScheduleInfo();

            result.Add(t1);
            result.Add(t2);
            result.Add(t3);*/

            return result.ToArray();
        }

    }
}