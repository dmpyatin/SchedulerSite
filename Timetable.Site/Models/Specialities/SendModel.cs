﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;

namespace Timetable.Site.Models.Specialities
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

        public SendModel(Speciality t)
        {
            this.Id = t.Id;
            this.Name = t.Name;
            if (t.ShortName != null)
                this.Name = t.ShortName;
            if (t.Code != null)
                this.Name += "(" + t.Code + ")";
        }
    }
}