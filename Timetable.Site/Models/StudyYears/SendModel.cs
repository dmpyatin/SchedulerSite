﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Timetable.Site.DataService;
using System.Runtime.Serialization;

namespace Timetable.Site.Models.StudyYears
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Id")]
        int Id;

        [DataMember(Name = "Name")]
        string Name;

        public SendModel() { }
        public SendModel(int Id, string Name)
        {
            this.Id = Id;
            this.Name = Name;
        }

        public SendModel(StudyYear t)
        {
            this.Id = t.Id;
            this.Name = t.Id.ToString();
        }
    }
}