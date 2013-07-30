using System;
using System.ComponentModel;
using System.ServiceModel;
using System.Net.Http;
using System.Net;
using System.Configuration;
using Timetable.Site.DataService;
using Timetable.Site.UserService;


namespace Timetable.Site.Controllers.Api
{
    public abstract class BaseApiController<T> : System.Web.Http.ApiController, INotifyPropertyChanged
    {

        #region Services
        protected readonly IDataService DataService;
        protected readonly IUserService UserService;
        #endregion

        public BaseApiController()
        {
            DataService = new DataServiceClient();
           // UserService = new UserServiceClient();
        }

        protected T GetService<T>(string serviceName)
        {
            var url = ConfigurationManager.AppSettings[serviceName];

            if (String.IsNullOrEmpty(url))
                throw new ArgumentNullException("url");

            var myBinding = new BasicHttpBinding(){ CloseTimeout = new TimeSpan(0,10, 10, 0) };

            myBinding.MaxReceivedMessageSize = 2147483647;
            myBinding.MaxBufferSize = 2147483647;

            //var myBinding = new BasicHttpBinding();
            var myEndpoint = new EndpointAddress(url);
            var myChannelFactory = new ChannelFactory<T>(myBinding, myEndpoint);
            var host = myChannelFactory.CreateChannel();

            return host;
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged(string propertyName)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName));
        }
        
        protected HttpResponseMessage Response;

        protected HttpResponseMessage CreateResponse<T>(Func<T> func)
        {
            try
            {
                var result = func();

                Response = Request.CreateResponse<T>(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2>(Func<T1, T2> func, T1 arg)
        {
            try
            {
                var result = func(arg);

                Response = Request.CreateResponse<T2>(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3>(Func<T1, T2, T3> func, T1 arg1, T2 arg2)
        {
            try
            {
                var result = func(arg1, arg2);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4>(Func<T1, T2, T3, T4> func, T1 arg1, T2 arg2, T3 arg3)
        {
            try
            {
                var result = func(arg1, arg2, arg3);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }



        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5>(Func<T1, T2, T3, T4, T5> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }


        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6>(Func<T1, T2, T3, T4, T5, T6> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6, T7>(Func<T1, T2, T3, T4, T5, T6, T7> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5, arg6);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6, T7, T8>(Func<T1, T2, T3, T4, T5, T6, T7, T8> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5, arg6, arg7);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6, T7, T8, T9>(Func<T1, T2, T3, T4, T5, T6, T7, T8, T9> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(Func<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8, T9 arg9)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(Func<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8, T9 arg9, T10 arg10)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(Func<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8, T9 arg9, T10 arg10, T11 arg11)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(Func<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13> func, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5, T6 arg6, T7 arg7, T8 arg8, T9 arg9, T10 arg10, T11 arg11, T12 arg12)
        {
            try
            {
                var result = func(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);

                Response = Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse(Action action)
        {
            try
            {
                action();

                Response = Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }

        protected HttpResponseMessage CreateResponse<T>(Action<T> action, T arg)
        {
            try
            {
                action(arg);

                Response = Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                Response = Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Response;
        }
    }
}
