using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Schedules
{
    public class ForPrintModel
    {
        public int? lecturerId { get; set; }
        public int? auditoriumId { get; set; }
        public int? facultyId { get; set; }
        public string courseIds { get; set; }
        public string specialityIds { get; set; }
        public string groupIds { get; set; }
        public string subGroup { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
    }
}