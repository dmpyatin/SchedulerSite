using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;

namespace Timetable.Site.Models.Lecturers
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Id")]
        public int Id;

        [DataMember(Name = "Name")]
        public string Name;

        public SendModel() { }

        public SendModel(int Id, string Name)
        {
            this.Id = Id;
            this.Name = Name;
        }

        public SendModel(Lecturer t)
        {
            this.Name = "";
            if (t.Lastname != null && t.Firstname != null && t.Middlename != null)
                this.Name = t.Lastname + " " + t.Firstname[0] + ". " + t.Middlename[0] + ".";
        }
    }
}