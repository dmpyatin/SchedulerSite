using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Timetable.Site.DataService;

namespace Timetable.Site.Models.Groups
{
    public class AddModel
    {
        public string Code { get; set; }
        public int StudentsCount { get; set; }
        public int CourseId { get; set; }
        public int ParentId { get; set; }
        public int SpecialityId { get; set; }
    }
}