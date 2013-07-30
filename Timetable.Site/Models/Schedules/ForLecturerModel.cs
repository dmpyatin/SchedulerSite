using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Schedules
{
    public class ForLecturerModel
    {
        public int lecturerId { get; set; }
        public int studyYearId { get; set; }
        public int semesterId { get; set; }
        public int timetableId { get; set; }
    }
}