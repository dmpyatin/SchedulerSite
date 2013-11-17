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
        public string lcs(string a, string b)
        {
            string aSub = a.Substring(0, (a.Length - 1 < 0) ? 0 : a.Length - 1);
            string bSub = b.Substring(0, (b.Length - 1 < 0) ? 0 : b.Length - 1);

            if (a.Length == 0 || b.Length == 0)
                return "";
            else if (a[a.Length - 1] == b[b.Length - 1])
                return lcs(aSub, bSub) + a[a.Length - 1];
            else
            {
                string x = lcs(a, bSub);
                string y = lcs(aSub, b);
                return (x.Length > y.Length) ? x : y;
            }
        }

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

            var tmp = DataService.GetLecturersByFirstMiddleLastname(mask);

            var tmp2 = tmp.Where(x => !string.IsNullOrEmpty(x.Firstname) &&
            !string.IsNullOrEmpty(x.Lastname) &&
            !string.IsNullOrEmpty(x.Middlename))
            .Where(x => mask.Contains(x.Firstname) && mask.Contains(x.Lastname) && mask.Contains(x.Middlename)).ToList();

            foreach (var t in tmp2)
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