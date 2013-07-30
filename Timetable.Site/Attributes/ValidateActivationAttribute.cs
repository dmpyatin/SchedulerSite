using System;
using System.Web.Mvc;


namespace Timetable.Site.Attributes
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class ValidateActivationAttribute : ActionFilterAttribute
    {
        private readonly String _redirectTo;


        public ValidateActivationAttribute()
        {
            _redirectTo = "ActionDisabled";
        }

        public ValidateActivationAttribute(string redirectTo)
        {
            _redirectTo = redirectTo;
        }
    }
}
