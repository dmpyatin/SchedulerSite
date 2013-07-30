using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Schedules
{
    public class ForAuditoriumModel
    {
        public int auditoriumId { get; set; }
        public int studyYearId { get; set; }
        public int semesterId { get; set; }
        public int timetableId { get; set; }
    }
}