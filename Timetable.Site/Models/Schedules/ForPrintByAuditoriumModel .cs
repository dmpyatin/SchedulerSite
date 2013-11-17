using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Schedules
{
    public class ForPrintByAuditoriumModel
    {
        public int? auditoriumId { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
    }
}