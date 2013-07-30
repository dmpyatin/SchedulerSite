using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Lecturers;

namespace Timetable.Site.Controllers.Api
{
    public class LecturerController : BaseApiController<Lecturer>
    {
        //Получить преводавателей по идентификатору кафедры
        public HttpResponseMessage GetAll(int departmentId)
        {
            return CreateResponse<int, IEnumerable<SendModel>>(privateGetAll, departmentId);
        }

        private IEnumerable<SendModel> privateGetAll(int departmentId)
        {
            var result = new List<SendModel>();
            var qDepartment = new Department();
            qDepartment.Id = departmentId;
            var tmp = DataService.GetLecturersByDeparmentId(qDepartment);            
            foreach(var t in tmp){
                result.Add(new SendModel(t));
            }
            return result;
        }

        //Получить преподавателей по имени
        public HttpResponseMessage GetByMask(string mask)
        {
            return CreateResponse<string, IEnumerable<SendModel>>(privateGetByMask, mask);
        }

        private IEnumerable<SendModel> privateGetByMask(string mask)
        {
            var result = new List<SendModel>();

            mask = "Кузнецов Владимир Алексеевич";

            var tmp = DataService.GetLecturersByFirstMiddleLastname(mask);
            foreach (var t in tmp)
            {
                 result.Add(new SendModel(t));
            }
            return result;
        }

        [HttpPost]
        public HttpResponseMessage Add(AddModel model)
        {
            return CreateResponse(privateAdd, model);
        }

        public void privateAdd(AddModel model)
        {
            var aLecturer = new Lecturer();

            if (model.LFM != null)
            {
                int i = 1;
                foreach (var name in model.LFM.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (i == 1)
                    {
                        aLecturer.Lastname = name;    
                    }

                    if(i == 2){
                        aLecturer.Firstname = name;
                    }

                    if (i == 3)
                    {
                        aLecturer.Middlename = name;
                    }
                    i++;
                }
            }

            aLecturer.Contacts = model.Contacts;

            var Positions = new List<Position>();

            if (model.PositionIds != null)
            {
                foreach (var departmentId in model.PositionIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    var p = new Position();
                    Positions.Add(p);
                }
            }
            aLecturer.Positions = Positions.ToArray();


            var Departments = new List<Department>();

            if (model.DepartmentIds != null)
            {
                foreach (var departmentId in model.DepartmentIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    var d = new Department();
                    Departments.Add(d);
                }
            }

            aLecturer.Departments = Departments.ToArray();
            
            aLecturer.UpdateDate = DateTime.Now.Date;
            aLecturer.CreatedDate = DateTime.Now.Date;
            aLecturer.IsActual = true;

            DataService.Add(aLecturer);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dLecturer = new Lecturer();
            dLecturer.Id = Id;
            DataService.Delete(dLecturer);
        }
    }
}