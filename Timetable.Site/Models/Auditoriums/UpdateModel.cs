using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Auditoriums
{
    public class UpdateModel
    {
        public int Id { get; set; }
        public int BuildingId { get; set; }
        public int AuditoriumTypeId { get; set; }
        public string Number { get; set; }
        public int Capacity { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
    }
}