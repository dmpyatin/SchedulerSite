using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Schedules
{
    public class ForAllModel
    {
        public int lecturerId { get; set; }
        public int auditoriumId { get; set; }
        public int facultyId { get; set; }
        public string courseIds { get; set; }
        public string groupIds { get; set; }
        public string specialityIds { get; set; }
        public int studyYearId { get; set; }
        public int semesterId { get; set; }
        public int timetableId { get; set; }
        public string sequence { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }
    }
}