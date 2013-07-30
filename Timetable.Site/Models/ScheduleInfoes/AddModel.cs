namespace Timetable.Site.Models.ScheduleInfoes
{
    public class AddModel
    {
        public int LecturerId { get; set; }

        public int TutorialTypeId { get; set; }

        public int TutorialId { get; set; }

        public int DepartmentId { get; set; }

        public int HoursPerWeek { get; set; }

        public string FacultyIds { get; set; }

        public string GroupIds { get; set; }

        public string CourseIds { get; set; }

        public string SpecialityIds { get; set; }

        public string LikeAuditoriumIds { get; set; }

        public int Semester { get; set; }

        public int StudyYearId { get; set; }

        public int SubgroupCount { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }
    }
}