using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Hints
{
    public class ForAllModel
    {
        public int facultyId { get; set; }
        public int buildingId { get; set; }
        public int lecturerId { get; set; }
        public string courseIds { get; set; }
        public string groupIds { get; set; }
        public int studyYearId { get; set; }
        public int semesterId { get; set; }
        public int timetableId { get; set; }
        public int weekTypeId { get; set; }
        public int tutorialTypeId { get; set; }
        public int auditoriumTypeId { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
    }
}