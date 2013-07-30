using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Auditoriums
{
    public class ForFreeModel
    {
        public int buildingId { get; set; }
        public int weekTypeId { get; set; }
        public int day { get; set; }
        public int timeId { get; set; }
        public int tutorialTypeId { get; set; }
        public int auditoriumTypeId { get; set; }
    }
}