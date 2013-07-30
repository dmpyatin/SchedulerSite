using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Times
{
    public class AddModel
    {
        public string StartTime { get; set; }
        public string EndTime { get; set; } 
        public int BuildingId { get; set; }
    }
}