using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Timetable.Site.Attributes;
using Timetable.Site.Models;
using Timetable.Site.Controllers.Api;

namespace Timetable.Site.Controllers
{

    public class SignInController : BaseController
    {
        public ActionResult Index(string returnUrl)
        {
            return View();
            
        }

        //Обработчик входа
        [HttpPost]
        public bool Index(SignInModel model)
        {
            if (ModelState.IsValid)
            {
               // bool f = UserService.ValidateUser(model.UserName, model.Password);

               if (model.UserName == "admin" && model.Password == "admin")
               {
                    FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);

                    return true;
                }
                else
                {
                    ModelState.AddModelError("", "Имя пользователя или пароль некорректны");
                }
            }
           return false;
        }
         #region Private methods

        void RegistrationService_OnSuccess(object sender, EventArgs e)
        {
            Response.Redirect(Request["ReturnUrl"]);
        }

        void RegistrationService_OnFail(object sender, EventArgs e)
        {
            ModelState.AddModelError("Error", (sender as Exception).Message);
        }

        void AuthenticateService_OnFail(object sender, EventArgs e)
        {
            ModelState.AddModelError("Error", @Resources.Message.AuthorizeFailed);
        }

        #endregion
    }

    public partial class ScheduleController : BaseController
    {
        [Authorize]
        public ActionResult DatabaseView()
        {
            return RedirectToAction("Index", "Schedule/Database");
        }

        //Обработчик выхода
        [Authorize]
        public ActionResult SignOut()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Schedule");
        }

        [Authorize]
        public ActionResult InfoForSchedule()
        {
            return View("Config/InfoForSchedule");
        }

        //[Authorize]
        public ActionResult Index()
        {
            return View("NewCreate/Index");
        }

        [Authorize]
        public ActionResult Database()
        {
            return View("Database/Index");
        }

       
        public ActionResult Group()
        {
            return View("Group/Index");
        }

        [Authorize]
        public ActionResult Auditorium()
        {
            return View("Auditorium/Index");
        }

        [Authorize]
        public ActionResult Lecturer()
        {
            return View("Lecturer/Index");
        }


        [Authorize]
        public ActionResult DatabaseAuditoriums()
        {
            return View("Database/DBAuditoriumIndex");
        }

    }
}
