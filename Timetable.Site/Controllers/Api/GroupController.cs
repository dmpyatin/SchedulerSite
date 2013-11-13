using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Groups;
using System.Web.Http;

namespace Timetable.Site.Controllers.Api
{
    public partial class GroupController : BaseApiController<Group>
    {
        //Получить все группы, чей код попадает под маску 
        public HttpResponseMessage GetByCode(string code)
        {
            return CreateResponse<string, IEnumerable<SendModel>>(privateGetByCode, code);
        }

        private IEnumerable<SendModel> privateGetByCode(string code)
        {
            var result = new List<SendModel>();
            var tmp = DataService.GetGroupsByCode(code, 10);

            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }


        //Получить все группы по факультету, курсу и специальности (обзательно должен быть выбран факультет и курс, 
        //специальность может не выбираться
        public HttpResponseMessage GetAll(int facultyId, string courseIds, string specialityIds)
        {
            return CreateResponse<int, string, string, IEnumerable<SendModel>>(privateGetAll, facultyId, courseIds, specialityIds);
        }

        private IEnumerable<SendModel> privateGetAll(int facultyId, string courseIds, string specialityIds)
        {
            var result = new List<SendModel>();

            var qFaculty = new Faculty();
            qFaculty.Id = facultyId;

            if (courseIds != null)
            {
                foreach (var courseId in courseIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (courseId != " ")
                    {
                        int icourseId = int.Parse(courseId);

                        var qCourse = new Course();
                        qCourse.Id = icourseId;

                        if (specialityIds != null)
                        {
                            foreach (var specialityId in specialityIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                            {
                                if (specialityId != " ")
                                {
                                    int ispecialityId = int.Parse(specialityId);

                                    var qSpeciality = new Speciality();
                                    qSpeciality.Id = ispecialityId;

                       
                                    var tmp = DataService.GetGroupsForSpeciality(qCourse, qSpeciality);

                                    //var tmp = GetTempGroups(qCourse, qSpeciality);
                                    foreach (var t in tmp)
                                    {
                                        result.Add(new SendModel(t));
                                    }
                                }
                            }
                        }
                        else
                        {
                            var tmp = DataService.GetGroupsForCourse(qFaculty, qCourse);
                            //var tmp = GetTempGroups(qCourse, null);
                            foreach (var t in tmp)
                            {
                                result.Add(new SendModel(t));
                            }
                        }
                    }
                }
            }
           
            return result.AsEnumerable();
        }

        //Получить группы по специальностям
        public HttpResponseMessage GetBySpecialities(string specialityIds)
        {
            return CreateResponse<string, IEnumerable<SendModel>>(privateGetBySpecialities, specialityIds);
        }

        public IEnumerable<SendModel> privateGetBySpecialities(string specialityIds)
        {
            var result = new List<SendModel>();

            var courseController = new CourseController();
            var courses = courseController.privateGetAll();

            foreach (var cc in courses)
            {
                var qCourse = new Course();
                qCourse.Id = cc.Id;
                foreach (var specialityId in specialityIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (specialityId != " ")
                    {
                        int ispecialityId = int.Parse(specialityId);
                        var qSpeciality = new Speciality();
                        qSpeciality.Id = ispecialityId;


                        var tmp = DataService.GetGroupsForSpeciality(qCourse, qSpeciality);
                        foreach (var t in tmp)
                        {
                            result.Add(new SendModel(t));
                        }
                    }
                }
            }

            return result;
        }

        //Получить группы по курсам
        public HttpResponseMessage GetByCourses(int facultyId, string courseIds)
        {
            return CreateResponse<int, string, IEnumerable<SendModel>>(privateGetByCourses, facultyId, courseIds);
        }

        public IEnumerable<SendModel> privateGetByCourses(int facultyId, string courseIds)
        {
            var result = new List<SendModel>();

            var qFaculty = new Faculty();
            qFaculty.Id = facultyId;
            
            foreach (var courseId in courseIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                if (courseId != " ")
                {
                    int icourseId = int.Parse(courseId);
                    var qCourse = new Course();
                    qCourse.Id = icourseId;
                    var tmp = DataService.GetGroupsForCourse(qFaculty, qCourse);
                    foreach (var t in tmp)
                    {
                        result.Add(new SendModel(t));
                    }
                }
            }

            return result;
        }


        //Получить группы по курсу
        public HttpResponseMessage GetByCourse(int facultyId, int courseId)
        {
            return CreateResponse<int, int, IEnumerable<SendModel>>(privateGetByCourse, facultyId, courseId);
        }

        private IEnumerable<SendModel> privateGetByCourse(int facultyId, int courseId)
        {
            var result = new List<SendModel>();

            var qFaculty = new Faculty();
            var qCourse = new Course();
            qFaculty.Id = facultyId;
            qCourse.Id = courseId;

            var tmp = DataService.GetGroupsForCourse(qFaculty, qCourse);
            //var tmp = GetTempGroups(qCourse, null);
            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }



        public IEnumerable<SendModel> GetByIds(string groupIds)
        {
            var result = new List<SendModel>();

            if (groupIds != null)
            {
                foreach (var groupId in groupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (groupId != " ")
                    {
                        var tmp = DataService.GetGroupById(int.Parse(groupId));
                        //var tmp = GetTempGroupById(int.Parse(groupId));
                        result.Add(new SendModel(tmp));
                    }
                }
            }
            return result;
        }

        public IEnumerable<SendModel> GetBySpecialityIds(string courseIds, string specialityIds)
        {
            var result = new List<SendModel>();

            var courseController = new CourseController();

            var courses =  courseController.privateGetAll();

            if (courseIds != null)
                courses = courseController.GetByIds(courseIds);

            foreach (var cc in courses)
            {
                var qCourse = new Course() { Id = cc.Id };
                foreach (var specialityId in specialityIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (specialityId != " ")
                    {
                        var qSpeciality = new Speciality() { Id = int.Parse(specialityId)};
                        var tmp = DataService.GetGroupsForSpeciality(qCourse, qSpeciality);
                        foreach (var t in tmp)
                            result.Add(new SendModel(t));
                    }
                }
            }
            return result;
        }

        public IEnumerable<SendModel> GetByCourseIds(int? facultyId, string courseIds)
        {
            var result = new List<SendModel>();

            if(facultyId == null)
                return result;

            var courseController = new CourseController();
            var courses = courseController.GetByIds(courseIds);

            var qFaculty = new Faculty() { Id = facultyId.Value };
            foreach (var cc in courses)
            {
                var qCourse = new Course() { Id = cc.Id };
                var tmp = DataService.GetGroupsForCourse(qFaculty, qCourse);
                foreach (var t in tmp)
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
            var aGroup = new Group();

            aGroup.Code = model.Code;
            aGroup.StudentsCount = model.StudentsCount;
           
            aGroup.Course = new Course();
            aGroup.Course.Id = model.CourseId;
            aGroup.Parent = new Group();
            aGroup.Parent.Id = model.ParentId;
            aGroup.Speciality = new Speciality();
            aGroup.Speciality.Id = model.SpecialityId;
           

            aGroup.UpdateDate = DateTime.Now.Date;
            aGroup.CreatedDate = DateTime.Now.Date;
            aGroup.IsActual = true;

            DataService.Add(aGroup);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dGroup = new Group();
            dGroup.Id = Id;
            DataService.Delete(dGroup);
        }
    }



}