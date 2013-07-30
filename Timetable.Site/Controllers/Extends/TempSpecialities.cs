using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.ScheduleInfoes;

namespace Timetable.Site.Controllers.Api
{
    public partial class SpecialityController : BaseApiController<Speciality>
    {
        public Speciality[] GetTempSpecialities(Faculty f)
        {
            var result = new List<Speciality>();
            //Матфак
            if (f.Id == 1)
            {
                result.Add(CreateSpeciality(1, "230400.62", "Информационные системы и технологии", "ИСиТ"));
                result.Add(CreateSpeciality(5, "230400.65", "Информационные системы и технологии", "ИСиТ"));
                result.Add(CreateSpeciality(2, "080500.62", "Бизнес информатика", "БИ"));
                result.Add(CreateSpeciality(3, "010100.62", "Математика", "Математика"));
                result.Add(CreateSpeciality(4, "010400.62", "Прикладная математика и информатика", "ПМИ"));
            }

            return result.ToArray();
        }



        public Speciality CreateSpeciality(int Id, string Code, string Name, string ShortName)
        {
            var s1 = new Speciality();
            s1.Id = Id;
            s1.Code = Code;
            s1.Name = Name;
            s1.ShortName = ShortName;
            return s1;
        }
    }




}