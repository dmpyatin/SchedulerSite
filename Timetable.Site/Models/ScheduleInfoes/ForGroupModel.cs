using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.ScheduleInfoes
{
    public class ForGroupModel
    {
        public int facultyId { get; set; }
        public string courseIds { get; set; }
        public string groupIds { get; set; }
        public int tutorialTypeId { get; set; }
        public int studyYearId { get; set; }
        public int semesterId { get; set; }
    }
}