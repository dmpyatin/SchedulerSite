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
    public partial class AuditoriumController : BaseApiController<Auditorium>
    {
        public Auditorium[] GetTempAuditoriums(Building b, AuditoriumType at)
        {
            var result = new List<Auditorium>();
            if (b.Id == 1)
            {
                //Лекционные
                if (at.Id == 1)
                {
                    result.Add(CreateAuditorium(361, at.Id, b.Id));
                    result.Add(CreateAuditorium(146, at.Id, b.Id));
                    result.Add(CreateAuditorium(427, at.Id, b.Id));
                    result.Add(CreateAuditorium(138, at.Id, b.Id));
                    result.Add(CreateAuditorium(355, at.Id, b.Id));
                    result.Add(CreateAuditorium(152, at.Id, b.Id));
                    result.Add(CreateAuditorium(404, at.Id, b.Id));
                }
                //Лабораторные
                if (at.Id == 2)
                {
                    
                }
                //Дисплейные
                if (at.Id == 3)
                {
                    result.Add(CreateAuditorium(435, at.Id, b.Id));
                    result.Add(CreateAuditorium(341, at.Id, b.Id));
                    result.Add(CreateAuditorium(241, at.Id, b.Id));
                    result.Add(CreateAuditorium(239, at.Id, b.Id));
                    result.Add(CreateAuditorium(205, at.Id, b.Id));
                }
                //Кабинеты
                if (at.Id == 4)
                {
                    result.Add(CreateAuditorium(412, at.Id, b.Id));
                    result.Add(CreateAuditorium(412, at.Id, b.Id));
                }
            }

            if (b.Id == 2)
            {
                //Лекционные
                if (at.Id == 1)
                {
     
                }
                //Лабораторные
                if (at.Id == 2)
                {

                }
                //Дисплейные
                if (at.Id == 3)
                {

                }
                //Кабинеты
                if (at.Id == 4)
                {

                }
            }

            return result.ToArray();
        }


        public Auditorium CreateAuditorium(
            int Id, 
            int AudTypeId, 
            int BuildId)
        {
            var a1 = new Auditorium();

            a1.AuditoriumType = new AuditoriumType();
            a1.AuditoriumType.Id = AudTypeId;
            if(AudTypeId == 1)
                a1.AuditoriumType.Name = "Лекционная";

            if (AudTypeId == 2)
                a1.AuditoriumType.Name = "Лабораторная";

            if (AudTypeId == 3)
                a1.AuditoriumType.Name = "Дисплейная";

            if (AudTypeId == 4)
                a1.AuditoriumType.Name = "Кабинет";
    
            a1.Building = new Building();
            a1.Building.Id = BuildId;
            if (BuildId == 1)
            {
                a1.Building.Name = "Главный корпус";
                a1.Building.ShortName = "ГК";
            }
            if (BuildId == 2)
            {
                a1.Building.Name = "Теоритический корпус";
                a1.Building.ShortName = "ГК";
            }
           
            a1.Capacity = 30;
            a1.Number = Id.ToString();
            a1.Id = 2;
     
            return a1;
        }
    }




}