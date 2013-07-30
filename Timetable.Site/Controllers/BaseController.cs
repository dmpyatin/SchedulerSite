using System;
using System.Web.Mvc;
using System.Configuration;
using System.ServiceModel;
using Timetable.Site.UserService;

namespace Timetable.Site.Controllers
{
    public class BaseController : Controller
    {
        #region Services
        protected readonly IUserService UserService;
        #endregion
        
        public BaseController()
        {
            UserService = GetService<IUserService>("UserServiceAddress");
        }

        

        protected T GetService<T>(string serviceName)
        {
            
            var url = ConfigurationManager.AppSettings[serviceName];

            if (String.IsNullOrEmpty(url))
                throw new ArgumentNullException("url");

            var myBinding = new BasicHttpBinding() { CloseTimeout = new TimeSpan(0, 0, 10, 0) };

            myBinding.MaxReceivedMessageSize = 2147483647;
            myBinding.MaxBufferSize = 2147483647;

            var myEndpoint = new EndpointAddress(url);
            var myChannelFactory = new ChannelFactory<T>(myBinding, myEndpoint);
            var host = myChannelFactory.CreateChannel();

            return host;
        }
    }
}
